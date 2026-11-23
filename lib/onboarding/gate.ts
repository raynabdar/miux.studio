import type { BookingState, MeetingPreference } from '@/generated/prisma/enums'

type SubmissionLike = {
  meetingPreference: MeetingPreference
  meetingAcknowledgedAt: Date | null
  bookingState: BookingState
}

/**
 * "Create Your Account" unlocks only for the meeting path, once the meeting
 * step has been acknowledged/completed — or earlier if the owner explicitly
 * enabled early sign-up. The "No meeting" path never offers account creation.
 * A browser redirect alone is never treated as proof.
 */
export function isAccountCreationAllowed(input: {
  earlySignUpEnabled: boolean
  submission: SubmissionLike | null
}): boolean {
  const { submission, earlySignUpEnabled } = input
  if (!submission) return false
  if (submission.meetingPreference !== 'yes') return false
  if (earlySignUpEnabled) return true
  return submission.meetingAcknowledgedAt !== null || submission.bookingState === 'confirmed'
}
