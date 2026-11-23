import type { AccountStatus } from '@/generated/prisma/enums'

// Active requires BOTH Clerk email verification (mirrored via webhook) and
// explicit owner verification. Suspension always wins.
export function statusAfterVerification(input: {
  current: AccountStatus
  emailVerifiedAt: Date | null
  ownerVerifiedAt: Date | null
}): AccountStatus {
  if (input.current === 'suspended') return 'suspended'
  if (input.emailVerifiedAt && input.ownerVerifiedAt) return 'active'
  return 'pending_verification'
}
