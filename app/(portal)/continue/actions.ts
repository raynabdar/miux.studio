import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import { requireActiveUser, isFounder } from '@/lib/auth/session'
import { NAV_PREF_COOKIE, parseNavigationPreference, resolveDestination } from '@/lib/auth/routes'
import { auditSafe } from '@/lib/security/audit'

export async function chooseNavigationPreference(formData: FormData) {
  const preference = parseNavigationPreference(formData.get('preference'))
  if (!preference) redirect('/continue')

  const user = await requireActiveUser()
  const { userId } = await auth()
  const founder = isFounder(userId)
  const result = resolveDestination(user.role, preference)
  const allowed = result.allowed || founder

  const cookieStore = await cookies()
  cookieStore.set(NAV_PREF_COOKIE, preference, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  if (!allowed) {
    await auditSafe({
      actorClerkId: user.clerkId,
      actorRole: user.role,
      action: 'role.mismatch',
      targetType: 'navigation',
      targetId: preference,
      metadata: { storedRole: user.role, requested: preference },
    })
    redirect(result.destination)
  }

  redirect(result.destination)
}
