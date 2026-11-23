import { getDb } from '@/lib/db/client'
import { createNotification, emailClient } from '@/lib/portal/notifications'
import { auditSafe } from '@/lib/security/audit'

// Shared by the team workspace and the admin dashboard so the "seen" state
// transition, client notification and email happen exactly once.

export type Actor = { clerkId: string; role: 'team_member' | 'founder' }

export async function markRequestSeen(
  requestId: string,
  actor: Actor
): Promise<{ ok: boolean; changed: boolean }> {
  const db = getDb()
  const request = await db.meetingRequest.findUnique({
    where: { id: requestId },
    include: {
      client: { select: { fullName: true, email: true } },
      project: { select: { name: true } },
    },
  })
  if (!request) return { ok: false, changed: false }
  if (request.status !== 'pending') return { ok: true, changed: false }

  const now = new Date()
  // Conditional update keeps concurrent admin/team clicks from double-notifying.
  const updated = await db.meetingRequest.updateMany({
    where: { id: request.id, status: 'pending' },
    data: { status: 'seen', seenAt: now },
  })
  if (updated.count === 0) return { ok: true, changed: false }

  await createNotification({
    recipientClerkId: request.clientId,
    type: 'meeting_request_update',
    title: 'Your meeting request was reviewed',
    body: 'Our team has seen your request and will follow up. You can now request another meeting.',
    linkUrl: '/client',
    dedupeKey: `meeting-seen:${request.id}`,
  })
  await emailClient(request.clientId, 'Your meeting request was reviewed', [
    `Hi ${request.client.fullName ?? 'there'},`,
    '',
    'Our team has reviewed your meeting request and will follow up shortly.',
    request.project ? `Project: ${request.project.name}` : '',
  ])

  await auditSafe({
    actorClerkId: actor.clerkId,
    actorRole: actor.role,
    action: 'meeting.mark_seen',
    targetType: 'meeting_request',
    targetId: request.id,
  })

  return { ok: true, changed: true }
}
