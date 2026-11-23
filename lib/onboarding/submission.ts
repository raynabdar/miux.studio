import { getDb } from '@/lib/db/client'
import { isAccountCreationAllowed } from '@/lib/onboarding/gate'
import { REFERENCE_ID_PATTERN } from '@/lib/reference-id'
import { getEarlySignUpEnabled } from '@/lib/settings'

export async function getSubmissionByReferenceId(referenceId: string) {
  if (!process.env.DATABASE_URL) return null
  if (!REFERENCE_ID_PATTERN.test(referenceId)) return null
  return getDb().onboardingSubmission.findUnique({ where: { referenceId } })
}

export async function getOpenSubmissionForEmail(email: string) {
  if (!process.env.DATABASE_URL) return null
  return getDb().onboardingSubmission.findFirst({
    where: {
      email: email.trim().toLowerCase(),
      status: { in: ['submitted', 'meeting_acknowledged'] },
    },
  })
}

export type SignUpGate = {
  allowed: boolean
  submission: Awaited<ReturnType<typeof getSubmissionByReferenceId>>
}

export async function getSignUpGate(referenceId: string | undefined): Promise<SignUpGate> {
  if (!referenceId) return { allowed: false, submission: null }
  const [submission, earlySignUpEnabled] = await Promise.all([
    getSubmissionByReferenceId(referenceId),
    getEarlySignUpEnabled(),
  ])
  return {
    allowed: isAccountCreationAllowed({ earlySignUpEnabled, submission }),
    submission,
  }
}
