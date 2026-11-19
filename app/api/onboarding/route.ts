import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { SITE } from '@/lib/data'
import { onboardingSchema } from '@/lib/schemas'
import { getClientIp, isSameOrigin, rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const ip = getClientIp(request)
  const retryAfter = rateLimit(`onboarding:${ip}`, 120_000)
  if (retryAfter > 0) {
    return NextResponse.json(
      { error: 'Please wait two minutes before submitting again.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  try {
    const body = await request.json().catch(() => null)
    const parsed = onboardingSchema.safeParse(body)

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message || 'Please complete all required fields.'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const data = parsed.data

    // Honeypot: silently accept so bots do not retry.
    if (data.website && data.website.trim() !== '') {
      return NextResponse.json({ ok: true })
    }

    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.CONTACT_TO_EMAIL
    const from = process.env.CONTACT_FROM_EMAIL

    if (!apiKey || !to || !from) {
      return NextResponse.json(
        {
          error: `Onboarding delivery is not configured. Please write to ${SITE.email} and we will pick it up from there.`,
        },
        { status: 503 }
      )
    }

    const resend = new Resend(apiKey)

    const text = [
      '=== ONBOARDING QUESTIONS ===',
      '1. Company name and contact person?',
      data.q1,
      '',
      '2. What does your business do, and who are your customers?',
      data.q2,
      '',
      '3. Who are your main competitors?',
      data.q3,
      '',
      '4. What do you want to achieve in the next 6 to 12 months?',
      data.q4,
      '',
      '5. Is there a deadline or launch date?',
      data.q5,
      '',
      '=== SERVICES NEEDED ===',
      data.services.join(', '),
      '',
      '6. What is your budget range?',
      data.q6,
      '',
      '7. What is your ideal timeline?',
      data.q7,
      '',
      '=== BRAND (if you have one) ===',
      '8. Do you have a logo, colors, or fonts already?',
      data.q8 || 'Not specified',
      '',
      '9. What do you like or dislike about your current brand?',
      data.q9 || 'Not specified',
      '',
      '10. Which brands do you admire, inside or outside your industry?',
      data.q10 || 'Not specified',
      '',
      '11. Pick 3 words that describe how your brand should feel.',
      data.q11 || 'Not specified',
      '',
      '12. Do you have any must-keep elements?',
      data.q12 || 'Not specified',
      '',
      '=== DIGITAL AND SOCIAL (if relevant) ===',
      '13. Do you have a website or app? Share the link.',
      data.q13 || 'Not specified',
      '',
      '14. Which social platforms do you use or want to use?',
      data.q14 || 'Not specified',
      '',
      '15. Do you run ads now? If yes, what is your monthly budget?',
      data.q15 || 'Not specified',
      '',
      '=== AI AUTOMATION (if relevant) ===',
      '16. Which tasks take up the most time?',
      data.q16 || 'Not specified',
      '',
      '17. Which tools do you use today?',
      data.q17 || 'Not specified',
      '',
      '=== NEXT STEPS ===',
      '18. Anything else we should know?',
      data.q18,
      '',
      '19. Would you prefer a call or a written proposal next?',
      data.q19,
    ].join('\n')

    const result = await resend.emails.send({
      from,
      to: [to],
      subject: `New Client Onboarding: ${data.q1.slice(0, 50)}`,
      text,
    })

    if (result.error) {
      console.error('[onboarding] Resend rejected the submission:', result.error)
      return NextResponse.json(
        { error: 'Unable to deliver your onboarding answers right now. Please try again.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[onboarding] Unhandled error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred during onboarding.' },
      { status: 500 }
    )
  }
}
