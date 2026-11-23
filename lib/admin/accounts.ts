import { getDb } from '@/lib/db/client'
import { statusAfterVerification } from '@/lib/auth/status'
import { audit } from '@/lib/security/audit'
import { createNotification, emailClient } from '@/lib/portal/notifications'
import type { UserRole } from '@/generated/prisma/enums'

export type AdminResult = { ok: true } | { ok: false; message: string }

export function isFounderIdentity(clerkId: string): boolean {
  const founderId = process.env.FOUNDER_USER_ID
  return Boolean(founderId && clerkId === founderId)
}

export async function setAccountVerification(
  actorClerkId: string,
  clerkId: string,
  verify: boolean
): Promise<AdminResult> {
  const db = getDb()
  const target = await db.user.findUnique({ where: { clerkId } })
  if (!target) return { ok: false, message: 'Account not found.' }

  const ownerVerifiedAt = verify ? new Date() : null
  const status = statusAfterVerification({
    current: target.status,
    emailVerifiedAt: target.emailVerifiedAt,
    ownerVerifiedAt,
  })

  await db.user.update({
    where: { id: target.id },
    data: {
      ownerVerifiedAt,
      verifiedBy: verify ? actorClerkId : null,
      status,
    },
  })

  await audit({
    actorClerkId,
    actorRole: 'founder',
    action: verify ? 'account.verify' : 'account.unverify',
    targetType: 'user',
    targetId: target.clerkId,
    metadata: { status },
  })

  if (verify) {
    await createNotification({
      recipientClerkId: target.clerkId,
      type: 'account_event',
      title: 'Your account is approved',
      body: 'Your Miux Studio account is verified. Your client workspace is now available.',
      linkUrl: '/client',
    })
    await emailClient(target.clerkId, 'Your Miux Studio account is approved', [
      `Hi ${target.fullName ?? 'there'},`,
      '',
      'Your account has been verified. You can now access your client workspace.',
      '',
      'Portal: /client',
    ])
  }

  return { ok: true }
}

export async function changeClientRole(
  actorClerkId: string,
  clerkId: string,
  role: UserRole
): Promise<AdminResult> {
  if (isFounderIdentity(clerkId)) {
    return { ok: false, message: 'The founder role is configuration-only and cannot be assigned.' }
  }

  const db = getDb()
  const target = await db.user.findUnique({ where: { clerkId } })
  if (!target) return { ok: false, message: 'Account not found.' }
  if (target.role === role) return { ok: true }

  await db.user.update({ where: { id: target.id }, data: { role } })
  await audit({
    actorClerkId,
    actorRole: 'founder',
    action: 'admin.role_change',
    targetType: 'user',
    targetId: target.clerkId,
    metadata: { from: target.role, to: role },
  })

  return { ok: true }
}

export async function addClientNote(
  actorClerkId: string,
  clientId: string,
  body: string
): Promise<AdminResult> {
  const target = await getDb().user.findUnique({ where: { clerkId: clientId }, select: { id: true } })
  if (!target) return { ok: false, message: 'Account not found.' }

  await getDb().clientNote.create({ data: { clientId, authorClerkId: actorClerkId, body } })
  await audit({
    actorClerkId,
    actorRole: 'founder',
    action: 'client.note_add',
    targetType: 'user',
    targetId: clientId,
  })

  return { ok: true }
}
