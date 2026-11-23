import { describe, expect, it } from 'vitest'
import { isAccountCreationAllowed } from '@/lib/onboarding/gate'

const base = {
  meetingPreference: 'yes' as const,
  meetingAcknowledgedAt: null,
  bookingState: 'none' as const,
}

describe('account creation gate', () => {
  it('locks account creation before the meeting step', () => {
    expect(isAccountCreationAllowed({ earlySignUpEnabled: false, submission: base })).toBe(false)
  })

  it('unlocks after explicit meeting acknowledgment', () => {
    expect(
      isAccountCreationAllowed({
        earlySignUpEnabled: false,
        submission: { ...base, meetingAcknowledgedAt: new Date(), bookingState: 'acknowledged' },
      })
    ).toBe(true)
  })

  it('unlocks when the scheduling provider confirms the booking', () => {
    expect(
      isAccountCreationAllowed({
        earlySignUpEnabled: false,
        submission: { ...base, bookingState: 'confirmed' },
      })
    ).toBe(true)
  })

  it('unlocks early only when the owner enabled early sign-up', () => {
    expect(isAccountCreationAllowed({ earlySignUpEnabled: true, submission: base })).toBe(true)
  })

  it('never unlocks the "No meeting" path — even with acknowledgment', () => {
    expect(
      isAccountCreationAllowed({
        earlySignUpEnabled: true,
        submission: {
          meetingPreference: 'no',
          meetingAcknowledgedAt: new Date(),
          bookingState: 'confirmed',
        },
      })
    ).toBe(false)
  })

  it('locks when there is no submission', () => {
    expect(isAccountCreationAllowed({ earlySignUpEnabled: true, submission: null })).toBe(false)
  })
})
