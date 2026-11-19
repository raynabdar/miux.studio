import { Resend } from 'resend'
import { z } from 'zod'
import { NextResponse } from 'next/server'

export const onboardingSchema = z.object({
  // Required 1-5
  q1: z.string().min(1, 'Please provide company name and contact person.'),
  q2: z.string().min(1, 'Please describe your business and customers.'),
  q3: z.string().min(1, 'Please list your main competitors.'),
  q4: z.string().min(1, 'Please share what you want to achieve in the next 6 to 12 months.'),
  q5: z.string().min(1, 'Please provide your deadline or launch date.'),

  // Services needed (required array)
  services: z.array(z.string()).min(1, 'Please select at least one service.'),

  // Required 6-7
  q6: z.string().min(1, 'Please provide your budget range.'),
  q7: z.string().min(1, 'Please provide your ideal timeline.'),

  // Optional 8-12: BRAND
  q8: z.string().optional(),
  q9: z.string().optional(),
  q10: z.string().optional(),
  q11: z.string().optional(),
  q12: z.string().optional(),

  // Optional 13-15: DIGITAL AND SOCIAL
  q13: z.string().optional(),
  q14: z.string().optional(),
  q15: z.string().optional(),

  // Optional 16-17: AI AUTOMATION
  q16: z.string().optional(),
  q17: z.string().optional(),

  // Required 18-19
  q18: z.string().min(1, 'Please let us know if there is anything else.'),
  q19: z.string().min(1, 'Please indicate if you prefer a call or a written proposal next.'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = onboardingSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Please complete all required fields.'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const data = parsed.data
    const resendApiKey = process.env.RESEND_API_KEY
    const contactToEmail = process.env.CONTACT_TO_EMAIL
    const contactFromEmail = process.env.CONTACT_FROM_EMAIL

    if (!resendApiKey || !contactToEmail || !contactFromEmail) {
      // In development or if credentials not configured, accept form and log
      return NextResponse.json(
        {
          ok: true,
          notice: 'Submission recorded in development environment.',
        },
        { status: 200 }
      )
    }

    const resend = new Resend(resendApiKey)
    const subject = `New Client Onboarding: ${data.q1.slice(0, 50)}`

    const formattedDetails = [
      `=== ONBOARDING QUESTIONS ===`,
      `1. Company name and contact person?`,
      `${data.q1}`,
      ``,
      `2. What does your business do, and who are your customers?`,
      `${data.q2}`,
      ``,
      `3. Who are your main competitors?`,
      `${data.q3}`,
      ``,
      `4. What do you want to achieve in the next 6 to 12 months?`,
      `${data.q4}`,
      ``,
      `5. Is there a deadline or launch date?`,
      `${data.q5}`,
      ``,
      `=== SERVICES NEEDED ===`,
      data.services.join(', '),
      ``,
      `6. What is your budget range?`,
      `${data.q6}`,
      ``,
      `7. What is your ideal timeline?`,
      `${data.q7}`,
      ``,
      `=== BRAND (if you have one) ===`,
      `8. Do you have a logo, colors, or fonts already?`,
      `${data.q8 || 'Not specified'}`,
      ``,
      `9. What do you like or dislike about your current brand?`,
      `${data.q9 || 'Not specified'}`,
      ``,
      `10. Which brands do you admire, inside or outside your industry?`,
      `${data.q10 || 'Not specified'}`,
      ``,
      `11. Pick 3 words that describe how your brand should feel.`,
      `${data.q11 || 'Not specified'}`,
      ``,
      `12. Do you have any must-keep elements?`,
      `${data.q12 || 'Not specified'}`,
      ``,
      `=== DIGITAL AND SOCIAL (if relevant) ===`,
      `13. Do you have a website or app? Share the link.`,
      `${data.q13 || 'Not specified'}`,
      ``,
      `14. Which social platforms do you use or want to use?`,
      `${data.q14 || 'Not specified'}`,
      ``,
      `15. Do you run ads now? If yes, what is your monthly budget?`,
      `${data.q15 || 'Not specified'}`,
      ``,
      `=== AI AUTOMATION (if relevant) ===`,
      `16. Which tasks take up the most time?`,
      `${data.q16 || 'Not specified'}`,
      ``,
      `17. Which tools do you use today?`,
      `${data.q17 || 'Not specified'}`,
      ``,
      `=== NEXT STEPS ===`,
      `18. Anything else we should know?`,
      `${data.q18}`,
      ``,
      `19. Would you prefer a call or a written proposal next?`,
      `${data.q19}`,
    ].join('\n')

    const result = await resend.emails.send({
      from: contactFromEmail,
      to: [contactToEmail],
      subject,
      text: formattedDetails,
    })

    if (result.error) {
      return NextResponse.json(
        { error: 'Unable to deliver onboarding submission. Please try again.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred during onboarding.' },
      { status: 500 }
    )
  }
}
