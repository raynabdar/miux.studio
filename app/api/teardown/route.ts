import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { SITE } from '@/lib/data'
import { teardownSchema } from '@/lib/schemas'
import { getClientIp, isSameOrigin, rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const ip = getClientIp(request)
  const retryAfter = rateLimit(`teardown:${ip}`, 120_000)
  if (retryAfter > 0) {
    return NextResponse.json(
      { error: 'Please wait a couple of minutes before sending another request.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  try {
    const body = await request.json().catch(() => null)
    const parsed = teardownSchema.safeParse(body)

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || 'Please check your input and try again.'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const { name, email, website, notes, company } = parsed.data

    // Honeypot: silently accept so bots do not retry.
    if (company && company.trim() !== '') {
      return NextResponse.json({ ok: true })
    }

    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.CONTACT_TO_EMAIL
    const from = process.env.CONTACT_FROM_EMAIL

    if (!apiKey || !to || !from) {
      return NextResponse.json(
        { error: `Email delivery is not configured. Please write to ${SITE.email} directly.` },
        { status: 503 }
      )
    }

    const resend = new Resend(apiKey)

    const result = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Teardown request from ${name} | ${SITE.name}`,
      text: `New teardown request via ${SITE.url.replace('https://', '')}:

Name: ${name}
Email: ${email}
Website: ${website}

Extra context:
${notes && notes.trim() !== '' ? notes : 'None provided'}
`,
    })

    if (result.error) {
      console.error('[teardown] Resend rejected the request:', result.error)
      return NextResponse.json(
        { error: `Unable to send your request right now. Please try again or write to ${SITE.email}.` },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[teardown] Unhandled error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
