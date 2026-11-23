import { describe, expect, it } from 'vitest'
import {
  NAV_PREF_COOKIE,
  ROLE_HOME,
  parseNavigationPreference,
  resolveDestination,
} from '@/lib/auth/routes'

describe('role routing', () => {
  it('maps roles to their dashboards', () => {
    expect(ROLE_HOME.client).toBe('/client')
    expect(ROLE_HOME.team_member).toBe('/team')
    expect(NAV_PREF_COOKIE).toBe('miux-nav-preference')
  })

  it('allows a role to reach its own dashboard', () => {
    expect(resolveDestination('client', 'client')).toEqual({
      allowed: true,
      destination: '/client',
    })
  })

  it('rejects and redirects a mismatch (preference never grants access)', () => {
    expect(resolveDestination('client', 'team_member')).toEqual({
      allowed: false,
      destination: '/client',
    })
    expect(resolveDestination('team_member', 'client')).toEqual({
      allowed: false,
      destination: '/team',
    })
  })

  it('parses only known preferences', () => {
    expect(parseNavigationPreference('client')).toBe('client')
    expect(parseNavigationPreference('team_member')).toBe('team_member')
    expect(parseNavigationPreference('admin')).toBeNull()
    expect(parseNavigationPreference(null)).toBeNull()
  })
})
