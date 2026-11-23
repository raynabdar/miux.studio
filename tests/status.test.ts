import { describe, expect, it } from 'vitest'
import { statusAfterVerification } from '@/lib/auth/status'

describe('account status derivation', () => {
  it('stays pending until both email and owner verification are complete', () => {
    expect(
      statusAfterVerification({ current: 'pending_verification', emailVerifiedAt: null, ownerVerifiedAt: null })
    ).toBe('pending_verification')
    expect(
      statusAfterVerification({
        current: 'pending_verification',
        emailVerifiedAt: new Date(),
        ownerVerifiedAt: null,
      })
    ).toBe('pending_verification')
    expect(
      statusAfterVerification({
        current: 'pending_verification',
        emailVerifiedAt: null,
        ownerVerifiedAt: new Date(),
      })
    ).toBe('pending_verification')
  })

  it('activates only when both verifications exist', () => {
    expect(
      statusAfterVerification({
        current: 'pending_verification',
        emailVerifiedAt: new Date(),
        ownerVerifiedAt: new Date(),
      })
    ).toBe('active')
  })

  it('never overrides suspension', () => {
    expect(
      statusAfterVerification({
        current: 'suspended',
        emailVerifiedAt: new Date(),
        ownerVerifiedAt: new Date(),
      })
    ).toBe('suspended')
  })
})
