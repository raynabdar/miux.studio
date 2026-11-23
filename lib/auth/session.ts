import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getDb } from '@/lib/db/client'
import { ROLE_HOME } from '@/lib/auth/routes'
import { auditSafe } from '@/lib/security/audit'
import type { UserRole } from '@/generated/prisma/enums'

export function isFounder(userId: string | null | undefined): boolean {
  const founderId = process.env.FOUNDER_USER_ID
  return Boolean(founderId && userId && userId === founderId)
}

export async function currentDbUser() {
  const { userId } = await auth()
  if (!userId) return null
  return getDb().user.findUnique({ where: { clerkId: userId } })
}

export async function requireSessionUser() {
  const user = await currentDbUser()
  if (!user) redirect('/pending')
  return user
}

export async function requireActiveUser() {
  const user = await requireSessionUser()
  if (user.status !== 'active') redirect('/pending')
  return user
}

export async function requirePageRole(role: UserRole) {
  const user = await requireActiveUser()
  if (user.role === role || isFounder(user.clerkId)) return user

  await auditSafe({
    actorClerkId: user.clerkId,
    actorRole: user.role,
    action: 'role.mismatch',
    targetType: 'route',
    targetId: ROLE_HOME[role],
    metadata: { storedRole: user.role, requestedRoute: ROLE_HOME[role] },
  })
  redirect(ROLE_HOME[user.role])
}

export async function requireFounder() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  if (!isFounder(userId)) {
    const dbUser = await getDb().user.findUnique({ where: { clerkId: userId } })
    await auditSafe({
      actorClerkId: userId,
      actorRole: dbUser?.role ?? 'unknown',
      action: 'role.mismatch',
      targetType: 'route',
      targetId: '/founder',
      metadata: { storedRole: dbUser?.role ?? null, requestedRoute: '/founder' },
    })
    redirect(dbUser ? ROLE_HOME[dbUser.role] : '/pending')
  }

  return { userId }
}
