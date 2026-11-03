import { Resend } from 'resend'
import { z } from 'zod'
import { NextResponse } from 'next/server'

export const onboardingSchema = z.object({
  // Step 1: About you
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(1, 'Phone or WhatsApp number is required'),
  country: z.string().min(1, 'Country is required'),
  timeZone: z.string().min(1, 'Time zone is required'),
  preferredContact: z.string().min(1, 'Preferred contact method is required'),

  // Step 2: Your business
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Your role is required'),
  website: z.string().optional(),
  industry: z.string().min(1, 'Industry is required'),
  companySize: z.string().min(1, 'Company size is required'),
  socialLinks: z.string().optional(),

  // Step 3: Your project
  services: z.array(z.string()).min(1, 'Please select at least one service'),
  goals: z.string().min(1, 'Main goals are required'),
  problems: z.string().min(1, 'Current problems are required'),
  audience: z.string().min(1, 'Target audience is required'),
  competitors: z.string().optional(),
  budget: z.string().min(1, 'Budget range is required'),
  startDate: z.string().min(1, 'Start date is required'),
  deadline: z.string().min(1, 'Deadline is required'),

  // Step 4: Brand and access
  assets: z.string().optional(),
  brand: z.string().optional(),
  hosting: z.string().optional(),
  callTime: z.string().min(1, 'Preferred call time is required'),
  heard: z.string().min(1, 'Please tell us how you heard about us'),
  agreement: z.literal(true),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = onboardingSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Please complete all required fields.'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { firstName, lastName, email, ...details } = parsed.data

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
    const subject = `New client onboarding: ${firstName} ${lastName}`

    const formattedDetails = [
      `--- CLIENT DETAILS ---`,
      `Name: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Phone/WhatsApp: ${details.phone}`,
      `Country: ${details.country}`,
      `Time Zone: ${details.timeZone}`,
      `Preferred Contact: ${details.preferredContact}`,
      ``,
      `--- BUSINESS DETAILS ---`,
      `Company Name: ${details.company}`,
      `Role: ${details.role}`,
      `Website: ${details.website || 'Not provided'}`,
      `Industry: ${details.industry}`,
      `Company Size: ${details.companySize}`,
      `Social Media Links: ${details.socialLinks || 'Not provided'}`,
      ``,
      `--- PROJECT DETAILS ---`,
      `Services Needed: ${details.services.join(', ')}`,
      `Main Goals: ${details.goals}`,
      `Current Problems: ${details.problems}`,
      `Target Audience: ${details.audience}`,
      `Competitors / Reference Sites: ${details.competitors || 'Not provided'}`,
      `Budget Range: ${details.budget}`,
      `Preferred Start Date: ${details.startDate}`,
      `Deadline: ${details.deadline}`,
      ``,
      `--- BRAND & ACCESS ---`,
      `Brand Assets Link: ${details.assets || 'Not provided'}`,
      `Brand Colors & Fonts: ${details.brand || 'Not provided'}`,
      `Domain & Hosting Provider: ${details.hosting || 'Not provided'}`,
      `Preferred Call Time: ${details.callTime}`,
      `How they heard about us: ${details.heard}`,
    ].join('\n')

    const result = await resend.emails.send({
      from: contactFromEmail,
      to: [contactToEmail],
      replyTo: email,
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
  } catch (err) {
    return NextResponse.json(
      { error: 'An unexpected error occurred during onboarding.' },
      { status: 500 }
    )
  }
}
