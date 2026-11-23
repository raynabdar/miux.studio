import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

vi.mock('@/lib/db/client', () => ({ getDb: vi.fn() }))
vi.mock('@/lib/security/audit', () => ({ audit: vi.fn() }))
vi.mock('@/lib/portal/notifications', () => ({
  createNotification: vi.fn(),
  emailClient: vi.fn(),
}))

import { isFounderIdentity } from '@/lib/admin/accounts'
import { clientNoteSchema, roleChangeSchema, verifyAccountSchema } from '@/lib/validation/admin'
import { markMeetingSchema } from '@/lib/validation/portal'

const UUID = '5f1b3c1e-8a2d-4a5e-9c7b-1d2e3f4a5b6c'

describe('admin validation', () => {
  it('accepts a valid internal note', () => {
    expect(clientNoteSchema.safeParse({ clientId: 'user_123', body: 'Prefers calls on Fridays.' }).success).toBe(true)
  })

  it('rejects empty and oversized notes', () => {
    expect(clientNoteSchema.safeParse({ clientId: 'user_123', body: ' ' }).success).toBe(false)
    expect(clientNoteSchema.safeParse({ clientId: 'user_123', body: 'x'.repeat(4001) }).success).toBe(false)
  })

  it('only allows client/team_member role changes', () => {
    expect(roleChangeSchema.safeParse({ clerkId: 'user_123', role: 'client' }).success).toBe(true)
    expect(roleChangeSchema.safeParse({ clerkId: 'user_123', role: 'team_member' }).success).toBe(true)
    expect(roleChangeSchema.safeParse({ clerkId: 'user_123', role: 'founder' }).success).toBe(false)
    expect(roleChangeSchema.safeParse({ clerkId: 'user_123', role: 'owner' }).success).toBe(false)
  })

  it('validates verification payloads', () => {
    expect(verifyAccountSchema.safeParse({ clerkId: 'user_123', mode: 'verify' }).success).toBe(true)
    expect(verifyAccountSchema.safeParse({ clerkId: 'user_123', mode: 'delete' }).success).toBe(false)
  })

  it('rejects malformed meeting request ids', () => {
    expect(markMeetingSchema.safeParse({ requestId: UUID }).success).toBe(true)
    expect(markMeetingSchema.safeParse({ requestId: 'not-a-uuid' }).success).toBe(false)
  })
})

describe('founder identity', () => {
  const original = process.env.FOUNDER_USER_ID

  beforeEach(() => {
    process.env.FOUNDER_USER_ID = 'user_founder'
  })

  afterEach(() => {
    if (original === undefined) delete process.env.FOUNDER_USER_ID
    else process.env.FOUNDER_USER_ID = original
  })

  it('matches only the configured founder', () => {
    expect(isFounderIdentity('user_founder')).toBe(true)
    expect(isFounderIdentity('user_other')).toBe(false)
  })

  it('fails closed when the founder id is not configured', () => {
    delete process.env.FOUNDER_USER_ID
    expect(isFounderIdentity('user_founder')).toBe(false)
  })
})
