import { createHmac, timingSafeEqual } from 'node:crypto'
import { getDb } from '@/lib/db/client'
import { auditSafe } from '@/lib/security/audit'

export const dynamic = 'force-dynamic'

type CalComPayload = {
  triggerEvent?: string
  payload?: {
    uid?: string
    attendees?: Array<{ email?: string }>
    metadata?: { referenceId?: string } | null
  }
}

function verifySignature(secret: string, rawBody: string, signature: string | null) {
  if (!signature) return false
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  const secret = process.env.CALCOM_WEBHOOK_SECRET
  const rawBody = await request.text()

  if (secret && !verifySignature(secret, rawBody, request.headers.get('x-cal-signature-256'))) {
    return new Response('Invalid signature', { status: 401 })
  }

  let body: CalComPayload
  try {
    body = JSON.parse(rawBody) as CalComPayload
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  if (body.triggerEvent !== 'BOOKING_CREATED') {
    return Response.json({ ok: true, ignored: true })
  }

  const referenceId = body.payload?.metadata?.referenceId
  const attendeeEmail = body.payload?.attendees?.[0]?.email

  const submission = referenceId
    ? await getDb().onboardingSubmission.findUnique({ where: { referenceId } })
    : attendeeEmail
      ? await getDb().onboardingSubmission.findFirst({
          where: {
            email: attendeeEmail.toLowerCase(),
            status: { in: ['submitted', 'meeting_acknowledged'] },
          },
          orderBy: { createdAt: 'desc' },
        })
      : null

  if (!submission) {
    return Response.json({ ok: true, matched: false })
  }

  await getDb().onboardingSubmission.update({
    where: { id: submission.id },
    data: {
      bookingState: 'confirmed',
      bookingExternalId: body.payload?.uid ?? null,
    },
  })

  await auditSafe({
    actorRole: 'system',
    action: 'meeting.confirm',
    targetType: 'onboarding_submission',
    targetId: submission.referenceId,
    metadata: { bookingExternalId: body.payload?.uid ?? null },
  })

  return Response.json({ ok: true, matched: true })
}
