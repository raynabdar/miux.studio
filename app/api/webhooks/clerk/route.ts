import { Webhook } from 'svix'
import { getDb } from '@/lib/db/client'
import { statusAfterVerification } from '@/lib/auth/status'

export const dynamic = 'force-dynamic'

type ClerkEmailAddress = {
  id: string
  email_address: string
  verification: { status: string } | null
}

type ClerkUserPayload = {
  id: string
  first_name: string | null
  last_name: string | null
  primary_email_address_id: string | null
  email_addresses: ClerkEmailAddress[]
}

function primaryEmail(data: ClerkUserPayload) {
  const primary =
    data.email_addresses.find((address) => address.id === data.primary_email_address_id) ??
    data.email_addresses[0]
  return primary ?? null
}

function fullName(data: ClerkUserPayload) {
  const name = [data.first_name, data.last_name].filter(Boolean).join(' ').trim()
  return name || null
}

export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET
  if (!secret) {
    return new Response('Webhook is not configured', { status: 503 })
  }

  const payload = await request.text()
  const svixHeaders = {
    'svix-id': request.headers.get('svix-id') ?? '',
    'svix-timestamp': request.headers.get('svix-timestamp') ?? '',
    'svix-signature': request.headers.get('svix-signature') ?? '',
  }

  try {
    new Webhook(secret).verify(payload, svixHeaders)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  let event: { type: string; data: unknown }
  try {
    event = JSON.parse(payload) as { type: string; data: unknown }
  } catch {
    return new Response('Invalid payload', { status: 400 })
  }

  const db = getDb()

  try {
    if (event.type === 'user.created' || event.type === 'user.updated') {
      const data = event.data as ClerkUserPayload
      const email = primaryEmail(data)
      if (!email) return new Response('No email on user', { status: 200 })

      const emailVerifiedAt = email.verification?.status === 'verified' ? new Date() : null
      const isFounder = data.id === process.env.FOUNDER_USER_ID
      const existing = await db.user.findUnique({ where: { clerkId: data.id } })

      if (existing) {
        const status = statusAfterVerification({
          current: existing.status,
          emailVerifiedAt,
          ownerVerifiedAt: existing.ownerVerifiedAt,
        })
        await db.user.update({
          where: { id: existing.id },
          data: {
            email: email.email_address.toLowerCase(),
            fullName: fullName(data),
            emailVerifiedAt,
            status,
            ...(isFounder ? { role: 'team_member' as const } : {}),
          },
        })
      } else {
        const status = statusAfterVerification({
          current: 'pending_verification',
          emailVerifiedAt,
          ownerVerifiedAt: null,
        })
        await db.user.create({
          data: {
            clerkId: data.id,
            email: email.email_address.toLowerCase(),
            fullName: fullName(data),
            role: isFounder ? 'team_member' : 'client',
            status,
            emailVerifiedAt,
          },
        })

        // Link the open onboarding submission (matched by email) to the account.
        await db.onboardingSubmission.updateMany({
          where: {
            email: email.email_address.toLowerCase(),
            clerkUserId: null,
            status: { in: ['submitted', 'meeting_acknowledged'] },
          },
          data: { clerkUserId: data.id, status: 'account_created' },
        })
      }

      return new Response('ok', { status: 200 })
    }

    if (event.type === 'user.deleted') {
      const data = event.data as { id?: string }
      if (data.id) {
        await db.user.deleteMany({ where: { clerkId: data.id } })
      }
      return new Response('ok', { status: 200 })
    }

    return new Response('ignored', { status: 200 })
  } catch (error) {
    // Log without exposing internals; return 200 to avoid retry storms on
    // duplicate/unique conflicts we cannot resolve.
    console.error('[clerk-webhook] handler failed', (error as Error).message)
    return new Response('handled with errors', { status: 200 })
  }
}
