'use server'

import { revalidatePath } from 'next/cache'
import { requirePageRole } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'
import { enforceLimit } from '@/lib/ratelimit'
import { loadTeamProject } from '@/lib/portal/access'
import { createNotification, emailClient } from '@/lib/portal/notifications'
import { markRequestSeen } from '@/lib/meetings'
import { auditSafe } from '@/lib/security/audit'
import {
  markMeetingSchema,
  publishUpdateSchema,
  sendMessageSchema,
} from '@/lib/validation/portal'

export type ActionResult = { ok: true } | { ok: false; message: string }

const DEMO_READ_ONLY = 'Demo mode is read-only. This action is disabled.'

export async function publishUpdate(input: unknown): Promise<ActionResult> {
  const user = await requirePageRole('team_member')
  if (user.isDemo) return { ok: false, message: DEMO_READ_ONLY }

  const parsed = publishUpdateSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid update.' }
  }

  const project = await loadTeamProject(user.clerkId, parsed.data.projectId)
  if (!project) return { ok: false, message: 'We could not find that project.' }

  await getDb().projectUpdate.create({
    data: {
      projectId: project.id,
      authorClerkId: user.clerkId,
      title: parsed.data.title,
      description: parsed.data.description,
      attachmentPath: parsed.data.attachmentUrl || null,
      attachmentName: parsed.data.attachmentName || null,
    },
  })

  await createNotification({
    recipientClerkId: project.clientId,
    type: 'project_update',
    title: `New update on ${project.name}`,
    body: parsed.data.title,
    linkUrl: `/client/projects/${project.id}`,
    dedupeKey: `update:${project.id}:${parsed.data.title}:${Date.now()}`,
  })
  await emailClient(
    project.clientId,
    `New update on ${project.name}`,
    [`${parsed.data.title}`, '', parsed.data.description.slice(0, 1500)]
  )

  await auditSafe({
    actorClerkId: user.clerkId,
    actorRole: 'team_member',
    action: 'project.update_publish',
    targetType: 'project',
    targetId: project.id,
    metadata: { title: parsed.data.title },
  })

  revalidatePath('/team')
  revalidatePath(`/team/projects/${project.id}`)
  revalidatePath(`/client/projects/${project.id}`)
  return { ok: true }
}

export async function sendTeamReply(input: unknown): Promise<ActionResult> {
  const user = await requirePageRole('team_member')
  if (user.isDemo) return { ok: false, message: DEMO_READ_ONLY }

  const parsed = sendMessageSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid message.' }
  }

  const project = await loadTeamProject(user.clerkId, parsed.data.projectId)
  if (!project) return { ok: false, message: 'We could not find that project.' }

  const limit = await enforceLimit('messaging', user.clerkId)
  if (!limit.ok) {
    return { ok: false, message: `You are sending messages too quickly. Try again in ${limit.retryAfterSeconds}s.` }
  }

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
      senderRole: 'team_member',
      body: parsed.data.body,
    },
  })
  await db.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: now, teamLastReadAt: now },
  })

  await createNotification({
    recipientClerkId: project.clientId,
    type: 'team_message',
    title: `New message from the Miux team`,
    body: parsed.data.body.slice(0, 200),
    linkUrl: `/client/projects/${project.id}`,
  })
  await emailClient(project.clientId, `New message about ${project.name}`, [
    parsed.data.body,
    '',
    `Reply in your portal: /client/projects/${project.id}`,
  ])

  revalidatePath(`/team/projects/${project.id}`)
  revalidatePath(`/client/projects/${project.id}`)
  return { ok: true }
}

export async function markTeamConversationRead(projectId: string): Promise<void> {
  const user = await requirePageRole('team_member')
  const project = await loadTeamProject(user.clerkId, projectId)
  if (!project) return
  await getDb().conversation.updateMany({
    where: { projectId: project.id },
    data: { teamLastReadAt: new Date() },
  })
}

export async function markMeetingSeen(input: unknown): Promise<ActionResult> {
  const user = await requirePageRole('team_member')
  if (user.isDemo) return { ok: false, message: DEMO_READ_ONLY }

  const parsed = markMeetingSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: 'Invalid request.' }

  const result = await markRequestSeen(parsed.data.requestId, {
    clerkId: user.clerkId,
    role: 'team_member',
  })
  if (!result.ok) return { ok: false, message: 'Request not found.' }

  revalidatePath('/team')
  return { ok: true }
}

export async function markMeetingSeenForm(formData: FormData): Promise<void> {
  const requestId = formData.get('requestId')
  if (typeof requestId !== 'string') return
  await markMeetingSeen({ requestId })
}
