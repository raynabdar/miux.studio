import type { UserRole } from '@/generated/prisma/enums'

export const ROLE_HOME: Record<UserRole, string> = {
  client: '/client',
  team_member: '/team',
}

export type NavigationPreference = UserRole

export const NAV_PREF_COOKIE = 'miux-nav-preference'

/**
 * The "How would you like to continue?" choice is a navigation preference only.
 * The stored role always decides permissions; a mismatch sends the user to
 * their real dashboard.
 */
export function resolveDestination(
  role: UserRole,
  requested: NavigationPreference
): { allowed: boolean; destination: string } {
  const allowed = role === requested
  return {
    allowed,
    destination: allowed ? ROLE_HOME[requested] : ROLE_HOME[role],
  }
}

export function parseNavigationPreference(value: unknown): NavigationPreference | null {
  return value === 'client' || value === 'team_member' ? value : null
}
