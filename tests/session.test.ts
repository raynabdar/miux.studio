import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

class RedirectError extends Error {
  constructor(url: string) {
    super(`redirect:${url}`)
  }
}

const { authMock, findUnique, auditSafeMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  findUnique: vi.fn(),
  auditSafeMock: vi.fn(),
}))

vi.mock('@clerk/nextjs/server', () => ({ auth: authMock }))
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new RedirectError(url)
  }),
}))
vi.mock('@/lib/db/client', () => ({
  getDb: () => ({ user: { findUnique } }),
}))
vi.mock('@/lib/security/audit', () => ({ auditSafe: auditSafeMock }))

import { requireActiveUser, requireFounder, requirePageRole } from '@/lib/auth/session'

const baseUser = {
  id: 'uuid-1',
  clerkId: 'user_client',
  email: 'client@example.com',
  fullName: 'Client',
  company: null,
  role: 'client' as const,
  status: 'active' as const,
  emailVerifiedAt: new Date(),
  ownerVerifiedAt: new Date(),
  verifiedBy: null,
  isDemo: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

beforeEach(() => {
  authMock.mockReset().mockResolvedValue({ userId: 'user_client' })
  findUnique.mockReset()
  auditSafeMock.mockReset()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('pending verification restrictions', () => {
  it('sends accounts without a database record to /pending', async () => {
    findUnique.mockResolvedValue(null)
    await expect(requireActiveUser()).rejects.toThrow('redirect:/pending')
  })

  it('blocks accounts that are pending owner verification', async () => {
    findUnique.mockResolvedValue({ ...baseUser, status: 'pending_verification', ownerVerifiedAt: null })
    await expect(requirePageRole('client')).rejects.toThrow('redirect:/pending')
  })

  it('blocks suspended accounts', async () => {
    findUnique.mockResolvedValue({ ...baseUser, status: 'suspended' })
    await expect(requireActiveUser()).rejects.toThrow('redirect:/pending')
  })

  it('allows verified active accounts', async () => {
    findUnique.mockResolvedValue(baseUser)
    await expect(requireActiveUser()).resolves.toMatchObject({ clerkId: 'user_client' })
  })
})

describe('role authorization', () => {
  it('allows a client to open the client dashboard', async () => {
    findUnique.mockResolvedValue(baseUser)
    await expect(requirePageRole('client')).resolves.toMatchObject({ role: 'client' })
    expect(auditSafeMock).not.toHaveBeenCalled()
  })

  it('rejects a client requesting the team dashboard, logs the mismatch, and redirects home', async () => {
    findUnique.mockResolvedValue(baseUser)
    await expect(requirePageRole('team_member')).rejects.toThrow('redirect:/client')
    expect(auditSafeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'role.mismatch',
        targetType: 'route',
        metadata: expect.objectContaining({ storedRole: 'client', requestedRoute: '/team' }),
      })
    )
  })

  it('lets the configured founder reach both dashboards', async () => {
    vi.stubEnv('FOUNDER_USER_ID', 'user_founder')
    findUnique.mockResolvedValue({ ...baseUser, clerkId: 'user_founder' })
    await expect(requirePageRole('team_member')).resolves.toMatchObject({ clerkId: 'user_founder' })
    await expect(requirePageRole('client')).resolves.toMatchObject({ clerkId: 'user_founder' })
  })
})

describe('founder-only access', () => {
  it('redirects anonymous visitors to sign-in', async () => {
    authMock.mockResolvedValue({ userId: null })
    await expect(requireFounder()).rejects.toThrow('redirect:/sign-in')
  })

  it('rejects non-founders, logs the attempt, and redirects to their role home', async () => {
    vi.stubEnv('FOUNDER_USER_ID', 'user_founder')
    findUnique.mockResolvedValue({ ...baseUser, role: 'team_member' })
    await expect(requireFounder()).rejects.toThrow('redirect:/team')
    expect(auditSafeMock).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'role.mismatch', targetId: '/founder' })
    )
  })

  it('allows the configured founder id', async () => {
    vi.stubEnv('FOUNDER_USER_ID', 'user_founder')
    authMock.mockResolvedValue({ userId: 'user_founder' })
    await expect(requireFounder()).resolves.toEqual({ userId: 'user_founder' })
    expect(auditSafeMock).not.toHaveBeenCalled()
  })
})
