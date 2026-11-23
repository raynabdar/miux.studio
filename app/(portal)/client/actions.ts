'use server'

import { revalidatePath } from 'next/cache'
import { requirePageRole } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'
import { enforceLimit } from '@/lib/ratelimit'
import { loadClientProject } from '@/lib/portal/access'
import { markNotificationsRead, notifyActiveTeam } from '@/lib/portal/notifications'
import { askGemini } from '@/lib/ai/gemini'
import { sendOwnerAlert } from '@/lib/email/notify-owner'
import { auditSafe } from '@/lib/security/audit'
import {
  aiMessageSchema,
  meetingRequestSchema,
  sendMessageSchema,
} from '@/lib/validation/portal'

export type ActionResult = { ok: true } | { ok: false; message: string }
export type AssistantResult = { ok: true; text: string } | { ok: false; message: string }

const DEMO_READ_ONLY = 'Demo mode is read-only. This action is disabled.'
const TOO_FAST = (seconds: number) => `You are doing that too quickly. Try again in ${seconds}s.`

export async function sendClientMessage(input: unknown): Promise<ActionResult> {
  const user = await requirePageRole('client')
  if (user.isDemo) return { ok: false, message: DEMO_READ_ONLY }

  const parsed = sendMessageSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid message.' }
  }

  const project = await loadClientProject(user.clerkId, parsed.data.projectId)
  if (!project) return { ok: false, message: 'We could not find that project.' }

  const limit = await enforceLimit('messaging', user.clerkId)
  if (!limit.ok) return { ok: false, message: TOO_FAST(limit.retryAfterSeconds) }

  const db = getDb()
  const conversation = await db.conversation.upsert({
    where: { projectId: project.id },
    update: {},
    create: { projectId: project.id },
  })

  const now = new Date()
  await db.message.create({
    data: {
      conversationId: conversation.id,
      senderClerkId: user.clerkId,
      senderRole: 'client',
      body: parsed.data.body,
    },
  })
  await db.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: now, clientLastReadAt: now },
  })

  await notifyActiveTeam({
    type: 'team_message',
    title: `New message from ${project.client.fullName ?? project.client.email}`,
    body: parsed.data.body.slice(0, 200),
    linkUrl: `/team/projects/${project.id}`,
  })

  revalidatePath(`/client/projects/${project.id}`)
  return { ok: true }
}

export async function markClientConversationRead(projectId: string): Promise<void> {
  const user = await requirePageRole('client')
  const project = await loadClientProject(user.clerkId, projectId)
  if (!project) return
  await getDb().conversation.updateMany({
    where: { projectId: project.id },
    data: { clientLastReadAt: new Date() },
  })
}

export async function requestMeeting(input: unknown): Promise<ActionResult> {
  const user = await requirePageRole('client')
  if (user.isDemo) return { ok: false, message: DEMO_READ_ONLY }

  const parsed = meetingRequestSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid request.' }
  }

  const limit = await enforceLimit('meeting-request', user.clerkId)
  if (!limit.ok) return { ok: false, message: TOO_FAST(limit.retryAfterSeconds) }

  if (parsed.data.projectId) {
    const project = await loadClientProject(user.clerkId, parsed.data.projectId)
    if (!project) return { ok: false, message: 'We could not find that project.' }
  }

  try {
    await getDb().meetingRequest.create({
      data: {
        clientId: user.clerkId,
        projectId: parsed.data.projectId ?? null,
        message: parsed.data.message,
      },
    })
  } catch (error) {
    if ((error as { code?: string }).code === 'P2002') {
      return {
        ok: false,
        message:
          'You already have a pending meeting request. You can request another once our team has reviewed it.',
      }
    }
    console.error('[meeting] request failed', (error as Error).message)
    return { ok: false, message: 'Something went wrong. Please try again.' }
  }

  await notifyActiveTeam({
    type: 'meeting_request_update',
    title: `Meeting request from ${user.fullName ?? user.email}`,
    body: parsed.data.message.slice(0, 200),
    linkUrl: '/team',
  })
  await sendOwnerAlert(`Meeting request — ${user.fullName ?? user.email}`, [
    `Client: ${user.fullName ?? '(no name)'} <${user.email}>`,
    parsed.data.projectId ? `Project: ${parsed.data.projectId}` : 'Project: not specified',
    '',
    parsed.data.message,
  ])
  await auditSafe({
    actorClerkId: user.clerkId,
    actorRole: 'client',
    action: 'meeting.request',
    targetType: 'meeting_request',
    metadata: { projectId: parsed.data.projectId ?? null },
  })

  revalidatePath(parsed.data.projectId ? `/client/projects/${parsed.data.projectId}` : '/client')
  return { ok: true }
}

export async function readNotifications(): Promise<void> {
  const user = await requirePageRole('client')
  await markNotificationsRead(user.clerkId)
  revalidatePath('/client')
}

export async function askAssistant(input: unknown): Promise<AssistantResult> {
  const user = await requirePageRole('client')
  if (user.isDemo) return { ok: false, message: DEMO_READ_ONLY }

  const parsed = aiMessageSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid question.' }
  }

  const project = await loadClientProject(user.clerkId, parsed.data.projectId)
  if (!project) return { ok: false, message: 'We could not find that project.' }

  const limit = await enforceLimit('ai', user.clerkId)
  if (!limit.ok) return { ok: false, message: TOO_FAST(limit.retryAfterSeconds) }

  const db = getDb()
  const conversation = await db.conversation.upsert({
    where: { projectId: project.id },
    update: {},
    create: { projectId: project.id },
  })

  const [updates, recentMessages] = await Promise.all([
    db.projectUpdate.findMany({
      where: { projectId: project.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { title: true, description: true, createdAt: true },
    }),
    db.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { senderRole: true, body: true },
    }),
  ])

  const context = [
    `Project: ${project.name}`,
    `Status: ${project.status}`,
    project.startDate ? `Start: ${project.startDate.toISOString().slice(0, 10)}` : '',
    project.expectedCompletion
      ? `Expected completion: ${project.expectedCompletion.toISOString().slice(0, 10)}`
      : '',
    '',
    'Latest updates:',
    ...updates.map(
      (update) => `- ${update.createdAt.toISOString().slice(0, 10)} ${update.title}: ${update.description}`
    ),
    '',
    'Recent conversation:',
    ...recentMessages.reverse().map((message) => `- ${message.senderRole}: ${message.body}`),
  ]
    .filter((line) => line !== '')
    .join('\n')

  const systemInstruction = [
    "You are Miux Studio's project assistant.",
    'Answer only from the project context provided below. Never invent statuses, dates, or deliverables.',
    'Never reference other clients, other projects, internal tools, or confidential operations.',
    'If the answer needs information beyond the context, say so plainly and suggest using the "Request a meeting" option.',
    'Keep answers concise and friendly.',
    '',
    context,
  ].join('\n')

  const result = await askGemini({
    systemInstruction,
    turns: [...parsed.data.history, { role: 'user' as const, text: parsed.data.message }],
  })
  if (!result.ok) return result

  const now = new Date()
  await db.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        senderClerkId: user.clerkId,
        senderRole: 'client',
        body: parsed.data.message,
      },
      { conversationId: conversation.id, senderClerkId: null, senderRole: 'assistant', body: result.text },
    ],
  })
  await db.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: now, clientLastReadAt: now },
  })

  revalidatePath(`/client/projects/${project.id}`)
  return result
}
