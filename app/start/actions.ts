'use server'

import { headers } from 'next/headers'
import { getDb } from '@/lib/db/client'
import { acknowledgeMeetingSchema, startSubmissionSchema } from '@/lib/validation/onboarding'
import { enforceLimit } from '@/lib/ratelimit'
import { isTurnstileSecretConfigured, verifyTurnstile } from '@/lib/security/turnstile'
import { createWithReference } from '@/lib/reference-id'
import { hashIp } from '@/lib/security/hash'
import { auditSafe } from '@/lib/security/audit'
import { sendOwnerAlert } from '@/lib/email/notify-owner'
import { getOpenSubmissionForEmail } from '@/lib/onboarding/submission'

export type SubmitOnboardingResult =
  | { ok: true; referenceId: string; meetingPreference: 'yes' | 'no' }
  | { ok: false; message: string; retryAfterSeconds?: number }

async function requestContext() {
  const headerStore = await headers()
  const ip =
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerStore.get('x-real-ip') ||
    'unknown'
  return { ip, ipHash: hashIp(ip) }
}

export async function submitOnboarding(input: unknown): Promise<SubmitOnboardingResult> {
  const parsed = startSubmissionSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? 'Please check the form and try again.',
    }
  }
  const data = parsed.data
  const { ip, ipHash } = await requestContext()

  const limit = await enforceLimit('onboarding-submit', ip)
  if (!limit.ok) {
    return {
      ok: false,
      message: 'Too many submissions from this connection. Please try again shortly.',
      retryAfterSeconds: limit.retryAfterSeconds,
    }
  }

  const captchaConfigured = isTurnstileSecretConfigured()
  const captchaOk = captchaConfigured
    ? await verifyTurnstile(data.turnstileToken, { remoteIp: ip, expectedAction: 'onboarding' })
    : process.env.NODE_ENV !== 'production'
  if (!captchaOk) {
    return { ok: false, message: 'The verification challenge failed. Please try again.' }
  }

  const openSubmission = await getOpenSubmissionForEmail(data.email)
  if (openSubmission) {
    return {
      ok: false,
      message: `A request for this email is already open (reference ${openSubmission.referenceId}). Our team will be in touch — no need to resubmit.`,
    }
  }

  try {
    const submission = await createWithReference((referenceId) =>
      getDb().onboardingSubmission.create({
        data: {
          referenceId,
          fullName: data.fullName,
          email: data.email,
          company: data.company,
          service: data.service,
          budgetRange: data.budgetRange,
          message: data.message,
          meetingPreference: data.meetingPreference,
          ipHash,
        },
      })
    )

    await auditSafe({
      actorRole: 'public',
      action: 'onboarding.submit',
      targetType: 'onboarding_submission',
      targetId: submission.referenceId,
      metadata: { meetingPreference: data.meetingPreference },
      ipHash,
    })

    await sendOwnerAlert(`New onboarding submission — ${submission.referenceId}`, [
      `Reference: ${submission.referenceId}`,
      `Name: ${data.fullName}`,
      `Email: ${data.email}`,
      `Company: ${data.company}`,
      `Service: ${data.service}`,
      `Budget: ${data.budgetRange}`,
      `Meeting preference: ${data.meetingPreference}`,
      '',
      'Message:',
      data.message.slice(0, 2000),
    ])

    return {
      ok: true,
      referenceId: submission.referenceId,
      meetingPreference: data.meetingPreference,
    }
  } catch (error) {
    console.error('[onboarding] submission failed', (error as Error).message)
    return {
      ok: false,
      message: 'Something went wrong while saving your request. Please try again.',
    }
  }
}

export type AcknowledgeResult = { ok: boolean; message?: string }

export async function acknowledgeMeeting(input: unknown): Promise<AcknowledgeResult> {
  const parsed = acknowledgeMeetingSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: 'Invalid reference ID.' }

  const submission = await getDb().onboardingSubmission.findUnique({
    where: { referenceId: parsed.data.referenceId },
  })
  if (!submission) return { ok: false, message: 'We could not find that submission.' }
  if (submission.meetingPreference !== 'yes') {
    return { ok: false, message: 'This submission did not include a meeting step.' }
  }

  if (!submission.meetingAcknowledgedAt) {
    await getDb().onboardingSubmission.update({
      where: { id: submission.id },
      data: {
        meetingAcknowledgedAt: new Date(),
        bookingState: submission.bookingState === 'confirmed' ? 'confirmed' : 'acknowledged',
        status:
          submission.status === 'submitted' ? 'meeting_acknowledged' : submission.status,
      },
    })
    await auditSafe({
      actorRole: 'public',
      action: 'meeting.acknowledge',
      targetType: 'onboarding_submission',
      targetId: submission.referenceId,
    })
  }

  return { ok: true }
}
