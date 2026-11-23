import { getDb } from '@/lib/db/client'
import { sendEmail } from '@/lib/email/send'

type NotificationInput = {
  recipientClerkId: string
  type: 'team_message' | 'project_update' | 'meeting_request_update' | 'account_event'
  title: string
  body: string
  linkUrl?: string
  dedupeKey?: string
}

export async function createNotification(input: NotificationInput): Promise<void> {
  try {
    await getDb().notification.create({ data: input })
  } catch (error) {
    const code = (error as { code?: string }).code
    if (code !== 'P2002') {
      console.error('[notifications] failed to create', input.type, (error as Error).message)
    }
  }
}

export async function notifyActiveTeam(input: Omit<NotificationInput, 'recipientClerkId'>) {
  const team = await getDb().user.findMany({
    where: { role: 'team_member', status: 'active' },
    select: { clerkId: true },
  })
  await Promise.all(
    team.map((member) => createNotification({ ...input, recipientClerkId: member.clerkId }))
  )
}

export async function markNotificationsRead(clerkId: string): Promise<void> {
  await getDb().notification.updateMany({
    where: { recipientClerkId: clerkId, readAt: null },
    data: { readAt: new Date() },
  })
}

export async function emailClient(
  clerkId: string,
  subject: string,
  lines: string[]
): Promise<void> {
  const user = await getDb().user.findUnique({
    where: { clerkId },
    select: { email: true, isDemo: true },
  })
  if (!user || user.isDemo) return
  await sendEmail({ to: user.email, subject, lines })
}
