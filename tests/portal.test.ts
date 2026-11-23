import { describe, expect, it, beforeEach, vi } from 'vitest'

const { findFirstMock, isFounderMock } = vi.hoisted(() => ({
  findFirstMock: vi.fn(),
  isFounderMock: vi.fn(),
}))

vi.mock('@/lib/db/client', () => ({
  getDb: () => ({ project: { findFirst: findFirstMock } }),
}))

vi.mock('@/lib/auth/session', () => ({
  isFounder: isFounderMock,
}))

import { loadClientProject, loadTeamProject } from '@/lib/portal/access'
import {
  aiMessageSchema,
  meetingRequestSchema,
  publishUpdateSchema,
  sendMessageSchema,
} from '@/lib/validation/portal'

const UUID = '5f1b3c1e-8a2d-4a5e-9c7b-1d2e3f4a5b6c'

describe('portal validation', () => {
  it('accepts a valid chat message', () => {
    expect(sendMessageSchema.safeParse({ projectId: UUID, body: 'Hello team' }).success).toBe(true)
  })

  it('rejects empty and oversized chat messages', () => {
    expect(sendMessageSchema.safeParse({ projectId: UUID, body: '   ' }).success).toBe(false)
    expect(sendMessageSchema.safeParse({ projectId: UUID, body: 'a'.repeat(2001) }).success).toBe(false)
    expect(sendMessageSchema.safeParse({ projectId: 'not-a-uuid', body: 'hi' }).success).toBe(false)
  })

  it('requires a meaningful meeting request message', () => {
    expect(meetingRequestSchema.safeParse({ message: 'too short' }).success).toBe(false)
    expect(
      meetingRequestSchema.safeParse({ message: 'I would like to review the homepage designs.' }).success
    ).toBe(true)
    expect(
      meetingRequestSchema.safeParse({
        message: 'I would like to review the homepage designs.',
        projectId: UUID,
      }).success
    ).toBe(true)
  })

  it('validates publish update payloads', () => {
    expect(
      publishUpdateSchema.safeParse({
        projectId: UUID,
        title: 'Week 3',
        description: 'Homepage build started.',
        attachmentUrl: '',
        attachmentName: '',
      }).success
    ).toBe(true)
    expect(
      publishUpdateSchema.safeParse({
        projectId: UUID,
        title: 'W',
        description: 'x',
        attachmentUrl: '',
        attachmentName: '',
      }).success
    ).toBe(false)
    expect(
      publishUpdateSchema.safeParse({
        projectId: UUID,
        title: 'Week 3',
        description: 'Homepage build started.',
        attachmentUrl: 'javascript:alert(1)',
        attachmentName: '',
      }).success
    ).toBe(false)
  })

  it('caps assistant history', () => {
    const history = Array.from({ length: 13 }, () => ({ role: 'user' as const, text: 'hi' }))
    expect(aiMessageSchema.safeParse({ projectId: UUID, message: 'status?', history }).success).toBe(false)
    expect(
      aiMessageSchema.safeParse({ projectId: UUID, message: 'status?', history: history.slice(0, 12) }).success
    ).toBe(true)
  })
})

describe('project access isolation', () => {
  beforeEach(() => {
    findFirstMock.mockReset()
    isFounderMock.mockReset()
  })

  it('scopes client lookups to the signed-in client', async () => {
    findFirstMock.mockResolvedValue(null)
    const result = await loadClientProject('user_other', UUID)
    expect(result).toBeNull()
    expect(findFirstMock).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: UUID, clientId: 'user_other' } })
    )
  })

  it('limits team members to projects they are assigned to', async () => {
    isFounderMock.mockReturnValue(false)
    await loadTeamProject('user_member', UUID)
    expect(findFirstMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: UUID, members: { some: { clerkId: 'user_member' } } },
      })
    )
  })

  it('lets the founder access any project', async () => {
    isFounderMock.mockReturnValue(true)
    await loadTeamProject('user_founder', UUID)
    expect(findFirstMock).toHaveBeenCalledWith(expect.objectContaining({ where: { id: UUID } }))
  })
})
