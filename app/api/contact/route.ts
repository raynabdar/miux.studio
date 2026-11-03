import { Resend } from 'resend'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  projectType: z.enum([
    'Brand Design and Identity',
    'Web Design',
    'Web Development',
    'UI/UX Design',
    'Ads and Campaigns',
    'Other',
  ]),
  budget: z.string().min(1, 'Please select a budget range'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  website: z.string().optional(), // Honeypot field
})

// In-memory rate limiting map: IP -> timestamp of last request
const rateLimitMap = new Map<string, number>()

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Rate limiting: 1 submission per 60 seconds per IP
    const now = Date.now()
    const lastAttempt = rateLimitMap.get(ip) || 0
    if (now - lastAttempt < 60_000) {
      return NextResponse.json(
        { error: 'Please wait a minute before submitting another enquiry.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parseResult = contactSchema.safeParse(body)

    if (!parseResult.success) {
      const errorMsg =
        parseResult.error.issues[0]?.message || 'Please check your input and try again.'
      return NextResponse.json({ error: errorMsg }, { status: 400 })
    }

    const { name, email, company, projectType, budget, message, website } =
      parseResult.data

    // If honeypot is triggered, silently succeed to mislead bots
    if (website && website.trim() !== '') {
      return NextResponse.json({ ok: true })
    }

    const resendApiKey = process.env.RESEND_API_KEY
    const contactToEmail = process.env.CONTACT_TO_EMAIL
    const contactFromEmail = process.env.CONTACT_FROM_EMAIL

    if (!resendApiKey || !contactToEmail || !contactFromEmail) {
      return NextResponse.json(
        {
          error:
            'Contact service is currently in test mode or email delivery is not configured yet. Please email hello@miux.studio directly.',
        },
        { status: 503 }
      )
    }

    const resend = new Resend(resendApiKey)

    const emailSubject = `New enquiry from ${name} | Miux Studio`
    const emailBody = `New enquiry received via miux.studio:

Full name: ${name}
Email: ${email}
Company: ${company && company.trim() !== '' ? company : 'Not provided'}
Project type: ${projectType}
Budget range: ${budget}

Message:
${message}
`

    const sendResult = await resend.emails.send({
      from: contactFromEmail,
      to: [contactToEmail],
      replyTo: email,
      subject: emailSubject,
      text: emailBody,
    })

    if (sendResult.error) {
      return NextResponse.json(
        { error: 'Unable to send enquiry right now. Please try again or reach out at hello@miux.studio.' },
        { status: 502 }
      )
    }

    rateLimitMap.set(ip, now)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
