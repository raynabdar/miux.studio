'use client'

import { useState } from 'react'
import { z } from 'zod'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileText,
} from 'lucide-react'

/* ─── Validation Schemas for Each Step ──────────────────────────────── */

const step1Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone or WhatsApp number is required'),
  country: z.string().min(1, 'Please select your country or region'),
  timeZone: z.string().min(1, 'Time zone is required'),
  preferredContact: z.string().min(1, 'Preferred contact method is required'),
})

const step2Schema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Your role is required'),
  website: z.string().optional(),
  industry: z.string().min(1, 'Industry is required'),
  companySize: z.string().min(1, 'Company size is required'),
  socialLinks: z.string().optional(),
})

const step3Schema = z.object({
  services: z.array(z.string()).min(1, 'Select at least one service'),
  goals: z.string().min(5, 'Please provide your main goals'),
  problems: z.string().min(5, 'Please describe current problems'),
  audience: z.string().min(3, 'Target audience is required'),
  competitors: z.string().optional(),
  budget: z.string().min(1, 'Budget range is required'),
  startDate: z.string().min(1, 'Start date is required'),
  deadline: z.string().min(1, 'Deadline is required'),
})

const step4Schema = z.object({
  assets: z.string().optional(),
  brand: z.string().optional(),
  hosting: z.string().optional(),
  callTime: z.string().min(1, 'Preferred call time is required'),
  heard: z.string().min(1, 'Please tell us how you heard about us'),
  agreement: z.literal(true),
})

type OnboardingData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  timeZone: string
  preferredContact: string

  company: string
  role: string
  website: string
  industry: string
  companySize: string
  socialLinks: string

  services: string[]
  goals: string
  problems: string
  audience: string
  competitors: string
  budget: string
  startDate: string
  deadline: string

  assets: string
  brand: string
  hosting: string
  callTime: string
  heard: string
  agreement: boolean
}

const initialData: OnboardingData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  timeZone: '',
  preferredContact: 'Email',

  company: '',
  role: '',
  website: '',
  industry: '',
  companySize: '',
  socialLinks: '',

  services: [],
  goals: '',
  problems: '',
  audience: '',
  competitors: '',
  budget: '',
  startDate: '',
  deadline: '',

  assets: '',
  brand: '',
  hosting: '',
  callTime: '',
  heard: '',
  agreement: false,
}

const SERVICES_OPTIONS = [
  'Brand Design and Identity',
  'Web Design',
  'Web Development',
  'UI/UX Design',
  'Ads and Campaigns',
  'Other',
] as const

const COUNTRY_OPTIONS = [
  'United Arab Emirates (UAE)',
  'Saudi Arabia',
  'Qatar',
  'Singapore',
  'Hong Kong',
  'Japan',
  'Malaysia',
  'Indonesia',
  'India',
  'Bangladesh',
  'Other Asian Country',
  'Other',
] as const

const COMPANY_SIZES = [
  '1 – 10 employees',
  '11 – 50 employees',
  '51 – 200 employees',
  '201 – 500 employees',
  '500+ employees',
] as const

const BUDGET_OPTIONS = [
  '$5,000 – $10,000',
  '$10,000 – $25,000',
  '$25,000 – $50,000',
  '$50,000+',
] as const

export default function OnboardingPage() {
  const [step, setStep] = useState(1) // 1: About you, 2: Your business, 3: Your project, 4: Brand & access, 5: Review
  const [data, setData] = useState<OnboardingData>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionError, setSubmissionError] = useState('')

  const updateField = (field: keyof OnboardingData, value: string | boolean | string[]) => {
    setData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const toggleService = (service: string) => {
    setData((prev) => {
      const exists = prev.services.includes(service)
      const nextServices = exists
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service]
      return { ...prev, services: nextServices }
    })
    if (errors.services) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.services
        return next
      })
    }
  }

  /* ── Per-Step Validation ─────────────────────────────────────────── */
  const validateStep = (currentStep: number): boolean => {
    setErrors({})
    let schema: z.ZodTypeAny | null = null

    if (currentStep === 1) schema = step1Schema
    else if (currentStep === 2) schema = step2Schema
    else if (currentStep === 3) schema = step3Schema
    else if (currentStep === 4) schema = step4Schema

    if (!schema) return true

    const result = schema.safeParse(data)
    if (!result.success) {
      const formattedErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        const key = String(err.path[0] || '')
        if (key && !formattedErrors[key]) {
          formattedErrors[key] = err.message
        }
      })
      setErrors(formattedErrors)
      return false
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmissionError('')

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const resJson = await response.json()

      if (!response.ok) {
        setSubmissionError(
          resJson.error || 'Unable to submit onboarding form. Please try again.'
        )
        setIsSubmitting(false)
        return
      }

      setIsSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setSubmissionError('Network error. Please try submitting again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── Confirmation Screen with Next Steps ─────────────────────────── */
  if (isSubmitted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#141414] px-5 py-20 text-white">
        <div className="w-full max-w-xl rounded-3xl border border-white/[0.1] bg-[#1A1A1A] p-8 text-center shadow-2xl sm:p-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-white text-[#141414]">
            <CheckCircle2 className="size-8" />
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-[#707070]">
            Miux Studio · Client Onboarding
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
            You are on our radar.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#A3A3A3] sm:text-base">
            Thank you, {data.firstName}. We have received your detailed onboarding submission.
          </p>

          {/* Next Steps Card */}
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#141414] p-6 text-left">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#707070]">
              What happens next
            </h2>
            <ol className="mt-4 space-y-4 text-sm text-[#A3A3A3]">
              <li className="flex items-start gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs text-white">
                  1
                </span>
                <span>
                  <strong>Internal Review:</strong> Our partners review your requirements, market references, and constraints within 24 hours.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs text-white">
                  2
                </span>
                <span>
                  <strong>Discovery Preparation:</strong> We tailor our 45-minute sprint discussion to your strategic goals.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs text-white">
                  3
                </span>
                <span>
                  <strong>Direct Outreach:</strong> We will reach out via {data.preferredContact} ({data.email}) to confirm our session time.
                </span>
              </li>
            </ol>
          </div>

          <div className="mt-8">
            <a
              href="/"
              className="inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#141414] transition-opacity hover:opacity-90"
            >
              Return to Homepage
            </a>
          </div>
        </div>
      </main>
    )
  }

  const stepTitles = [
    'About you',
    'Your business',
    'Your project',
    'Brand and access',
    'Review & submit',
  ]

  return (
    <main className="min-h-screen bg-[#141414] px-5 py-12 text-white">
      {/* Minimal Header */}
      <header className="mx-auto flex max-w-3xl items-center justify-between border-b border-white/[0.08] pb-6">
        <a href="/" className="font-semibold tracking-tight text-white hover:opacity-90">
          Miux Studio
        </a>
        <span className="rounded-full border border-white/[0.12] bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#A3A3A3]">
          Private Client Onboarding
        </span>
      </header>

      <div className="mx-auto max-w-3xl pt-8">
        {/* Progress Bar */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step indicator */}
        <div className="mt-4 flex items-center justify-between text-xs text-[#707070]">
          <span>
            Step {step} of 5: <span className="text-white font-medium">{stepTitles[step - 1]}</span>
          </span>
          <span>{Math.round((step / 5) * 100)}% completed</span>
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
          {stepTitles[step - 1]}
        </h1>

        {/* Global Error Banner */}
        {submissionError && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/20 bg-white/[0.04] p-4 text-sm text-[#A3A3A3]">
            <AlertCircle className="size-5 shrink-0 text-white" />
            <p>{submissionError}</p>
          </div>
        )}

        {/* ── STEP 1: About You ─────────────────────────────────────── */}
        {step === 1 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* First Name */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <input
                  id="firstName"
                  value={data.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="firstName"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  First name *
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
              {errors.firstName && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <input
                  id="lastName"
                  value={data.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="lastName"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Last name *
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
              {errors.lastName && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="email"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Email *
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.email}</p>
              )}
            </div>

            {/* Phone or WhatsApp */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <input
                  id="phone"
                  value={data.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="phone"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Phone or WhatsApp *
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.phone}</p>
              )}
            </div>

            {/* Country (select) */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <label
                  htmlFor="country"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070]"
                >
                  Country / Region *
                </label>
                <select
                  id="country"
                  value={data.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none [&>option]:bg-[#1A1A1A]"
                >
                  <option value="">Select country</option>
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
              {errors.country && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.country}</p>
              )}
            </div>

            {/* Time Zone */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <input
                  id="timeZone"
                  value={data.timeZone}
                  onChange={(e) => updateField('timeZone', e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="timeZone"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Time zone (e.g. GST, SGT, HKT) *
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
              {errors.timeZone && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.timeZone}</p>
              )}
            </div>

            {/* Preferred Contact Method */}
            <div className="relative sm:col-span-2">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <label
                  htmlFor="preferredContact"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070]"
                >
                  Preferred contact method *
                </label>
                <select
                  id="preferredContact"
                  value={data.preferredContact}
                  onChange={(e) => updateField('preferredContact', e.target.value)}
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none [&>option]:bg-[#1A1A1A]"
                >
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Google Meet">Google Meet / Video Call</option>
                  <option value="Phone">Phone call</option>
                </select>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
              {errors.preferredContact && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.preferredContact}</p>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: Your Business ─────────────────────────────────── */}
        {step === 2 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Company Name */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <input
                  id="company"
                  value={data.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="company"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Company name *
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
              {errors.company && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.company}</p>
              )}
            </div>

            {/* Your Role */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <input
                  id="role"
                  value={data.role}
                  onChange={(e) => updateField('role', e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="role"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Your role (e.g. Founder, CMO, VP Product) *
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
              {errors.role && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.role}</p>
              )}
            </div>

            {/* Current Website URL */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <input
                  id="website"
                  type="url"
                  value={data.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="website"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Current website URL
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
            </div>

            {/* Industry */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <input
                  id="industry"
                  value={data.industry}
                  onChange={(e) => updateField('industry', e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="industry"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Industry (e.g. Fintech, Healthcare, Luxury) *
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
              {errors.industry && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.industry}</p>
              )}
            </div>

            {/* Company Size (select) */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <label
                  htmlFor="companySize"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070]"
                >
                  Company size *
                </label>
                <select
                  id="companySize"
                  value={data.companySize}
                  onChange={(e) => updateField('companySize', e.target.value)}
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none [&>option]:bg-[#1A1A1A]"
                >
                  <option value="">Select size</option>
                  {COMPANY_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
              {errors.companySize && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.companySize}</p>
              )}
            </div>

            {/* Social Links */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <input
                  id="socialLinks"
                  value={data.socialLinks}
                  onChange={(e) => updateField('socialLinks', e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="socialLinks"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Social links (LinkedIn, X, Instagram)
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Your Project ──────────────────────────────────── */}
        {step === 3 && (
          <div className="mt-10 space-y-6">
            {/* Services needed (checkboxes) */}
            <div>
              <p className="text-xs uppercase tracking-wider text-[#707070] font-medium">
                Services needed * (Select all that apply)
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {SERVICES_OPTIONS.map((service) => {
                  const isChecked = data.services.includes(service)
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all ${
                        isChecked
                          ? 'border-white bg-white/[0.08] text-white'
                          : 'border-white/[0.08] bg-white/[0.02] text-[#A3A3A3] hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <div
                        className={`flex size-5 shrink-0 items-center justify-center rounded border transition-colors ${
                          isChecked
                            ? 'border-white bg-white text-[#141414]'
                            : 'border-white/30 bg-transparent'
                        }`}
                      >
                        {isChecked && <Check className="size-3.5 stroke-[3]" />}
                      </div>
                      <span>{service}</span>
                    </button>
                  )
                })}
              </div>
              {errors.services && (
                <p className="mt-2 text-xs text-[#A3A3A3]">{errors.services}</p>
              )}
            </div>

            {/* Main Goals */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <textarea
                  id="goals"
                  rows={3}
                  value={data.goals}
                  onChange={(e) => updateField('goals', e.target.value)}
                  placeholder=" "
                  className="peer w-full resize-none rounded-xl bg-transparent px-4 pb-3 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="goals"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Main business goals *
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
              {errors.goals && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.goals}</p>
              )}
            </div>

            {/* Current Problems */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <textarea
                  id="problems"
                  rows={3}
                  value={data.problems}
                  onChange={(e) => updateField('problems', e.target.value)}
                  placeholder=" "
                  className="peer w-full resize-none rounded-xl bg-transparent px-4 pb-3 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="problems"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Current problems with website or brand *
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
              {errors.problems && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.problems}</p>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Target Audience */}
              <div className="relative">
                <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                  <input
                    id="audience"
                    value={data.audience}
                    onChange={(e) => updateField('audience', e.target.value)}
                    placeholder=" "
                    className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                  />
                  <label
                    htmlFor="audience"
                    className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                  >
                    Target audience *
                  </label>
                  <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
                </div>
                {errors.audience && (
                  <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.audience}</p>
                )}
              </div>

              {/* Competitors or references */}
              <div className="relative">
                <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                  <input
                    id="competitors"
                    value={data.competitors}
                    onChange={(e) => updateField('competitors', e.target.value)}
                    placeholder=" "
                    className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                  />
                  <label
                    htmlFor="competitors"
                    className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                  >
                    Competitors or reference links
                  </label>
                  <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
                </div>
              </div>

              {/* Budget Range (select) */}
              <div className="relative">
                <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                  <label
                    htmlFor="budget"
                    className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070]"
                  >
                    Budget range *
                  </label>
                  <select
                    id="budget"
                    value={data.budget}
                    onChange={(e) => updateField('budget', e.target.value)}
                    className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none [&>option]:bg-[#1A1A1A]"
                  >
                    <option value="">Select range</option>
                    {BUDGET_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
                </div>
                {errors.budget && (
                  <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.budget}</p>
                )}
              </div>

              {/* Start Date */}
              <div className="relative">
                <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                  <input
                    id="startDate"
                    value={data.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                    placeholder=" "
                    className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                  />
                  <label
                    htmlFor="startDate"
                    className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                  >
                    Preferred start date *
                  </label>
                  <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
                </div>
                {errors.startDate && (
                  <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.startDate}</p>
                )}
              </div>

              {/* Deadline */}
              <div className="relative sm:col-span-2">
                <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                  <input
                    id="deadline"
                    value={data.deadline}
                    onChange={(e) => updateField('deadline', e.target.value)}
                    placeholder=" "
                    className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                  />
                  <label
                    htmlFor="deadline"
                    className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                  >
                    Target completion deadline *
                  </label>
                  <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
                </div>
                {errors.deadline && (
                  <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.deadline}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Brand and Access ──────────────────────────────── */}
        {step === 4 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Brand assets link */}
            <div className="relative sm:col-span-2">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <input
                  id="assets"
                  type="url"
                  value={data.assets}
                  onChange={(e) => updateField('assets', e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="assets"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Brand assets link (Google Drive, Figma, or Dropbox)
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
            </div>

            {/* Brand colors and fonts */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <input
                  id="brand"
                  value={data.brand}
                  onChange={(e) => updateField('brand', e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="brand"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Brand colors and fonts
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
            </div>

            {/* Domain and hosting provider */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <input
                  id="hosting"
                  value={data.hosting}
                  onChange={(e) => updateField('hosting', e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="hosting"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Domain & hosting provider
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
            </div>

            {/* Preferred call time */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <input
                  id="callTime"
                  value={data.callTime}
                  onChange={(e) => updateField('callTime', e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="callTime"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Preferred call time (e.g. Mornings GST) *
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
              {errors.callTime && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.callTime}</p>
              )}
            </div>

            {/* How you heard about us */}
            <div className="relative">
              <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50">
                <input
                  id="heard"
                  value={data.heard}
                  onChange={(e) => updateField('heard', e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                />
                <label
                  htmlFor="heard"
                  className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                >
                  How you heard about us *
                </label>
                <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
              </div>
              {errors.heard && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.heard}</p>
              )}
            </div>

            {/* Privacy Policy agreement checkbox */}
            <div className="sm:col-span-2 mt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.agreement}
                  onChange={(e) => updateField('agreement', e.target.checked)}
                  className="size-4 mt-0.5 rounded border-white/20 bg-white/5 accent-white"
                />
                <span className="text-sm text-[#A3A3A3]">
                  I agree to the{' '}
                  <a
                    href="/privacy"
                    target="_blank"
                    className="text-white underline underline-offset-4 hover:text-[#A3A3A3]"
                  >
                    Privacy Policy
                  </a>{' '}
                  and consent to Miux Studio storing this project data for our engagement.
                </span>
              </label>
              {errors.agreement && (
                <p className="mt-1.5 text-xs text-[#A3A3A3]">{errors.agreement}</p>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 5: Review Step ───────────────────────────────────── */}
        {step === 5 && (
          <div className="mt-10 space-y-8">
            <p className="text-sm text-[#A3A3A3]">
              Please review your information below before submitting. Click &ldquo;Edit&rdquo; on any section to make adjustments.
            </p>

            {/* Section 1 Review */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-[#707070]" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                    1. About you
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#A3A3A3] underline hover:text-white"
                >
                  Edit
                </button>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
                <div>
                  <dt className="text-[#707070]">Name</dt>
                  <dd className="mt-1 font-medium text-white">{data.firstName} {data.lastName}</dd>
                </div>
                <div>
                  <dt className="text-[#707070]">Email</dt>
                  <dd className="mt-1 font-medium text-white">{data.email}</dd>
                </div>
                <div>
                  <dt className="text-[#707070]">Phone / WhatsApp</dt>
                  <dd className="mt-1 font-medium text-white">{data.phone}</dd>
                </div>
                <div>
                  <dt className="text-[#707070]">Country</dt>
                  <dd className="mt-1 font-medium text-white">{data.country}</dd>
                </div>
                <div>
                  <dt className="text-[#707070]">Time zone</dt>
                  <dd className="mt-1 font-medium text-white">{data.timeZone}</dd>
                </div>
                <div>
                  <dt className="text-[#707070]">Preferred Contact</dt>
                  <dd className="mt-1 font-medium text-white">{data.preferredContact}</dd>
                </div>
              </dl>
            </div>

            {/* Section 2 Review */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-[#707070]" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                    2. Your business
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-[#A3A3A3] underline hover:text-white"
                >
                  Edit
                </button>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
                <div>
                  <dt className="text-[#707070]">Company</dt>
                  <dd className="mt-1 font-medium text-white">{data.company}</dd>
                </div>
                <div>
                  <dt className="text-[#707070]">Role</dt>
                  <dd className="mt-1 font-medium text-white">{data.role}</dd>
                </div>
                <div>
                  <dt className="text-[#707070]">Website</dt>
                  <dd className="mt-1 font-medium text-white">{data.website || 'None'}</dd>
                </div>
                <div>
                  <dt className="text-[#707070]">Industry</dt>
                  <dd className="mt-1 font-medium text-white">{data.industry}</dd>
                </div>
                <div>
                  <dt className="text-[#707070]">Company Size</dt>
                  <dd className="mt-1 font-medium text-white">{data.companySize}</dd>
                </div>
                <div>
                  <dt className="text-[#707070]">Social Links</dt>
                  <dd className="mt-1 font-medium text-white">{data.socialLinks || 'None'}</dd>
                </div>
              </dl>
            </div>

            {/* Section 3 Review */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-[#707070]" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                    3. Your project
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-[#A3A3A3] underline hover:text-white"
                >
                  Edit
                </button>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <p className="text-[#707070]">Services Needed</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {data.services.map((s) => (
                      <span key={s} className="rounded-full bg-white/[0.08] px-2.5 py-0.5 text-white">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[#707070]">Main Goals</p>
                    <p className="mt-1 text-white">{data.goals}</p>
                  </div>
                  <div>
                    <p className="text-[#707070]">Current Problems</p>
                    <p className="mt-1 text-white">{data.problems}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-2 border-t border-white/[0.06]">
                  <div>
                    <p className="text-[#707070]">Target Audience</p>
                    <p className="mt-1 text-white">{data.audience}</p>
                  </div>
                  <div>
                    <p className="text-[#707070]">Budget Range</p>
                    <p className="mt-1 text-white">{data.budget}</p>
                  </div>
                  <div>
                    <p className="text-[#707070]">Start Date</p>
                    <p className="mt-1 text-white">{data.startDate}</p>
                  </div>
                  <div>
                    <p className="text-[#707070]">Deadline</p>
                    <p className="mt-1 text-white">{data.deadline}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 Review */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-[#707070]" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                    4. Brand and access
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-xs text-[#A3A3A3] underline hover:text-white"
                >
                  Edit
                </button>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
                <div>
                  <dt className="text-[#707070]">Brand Assets</dt>
                  <dd className="mt-1 font-medium text-white truncate">{data.assets || 'None provided'}</dd>
                </div>
                <div>
                  <dt className="text-[#707070]">Colors & Fonts</dt>
                  <dd className="mt-1 font-medium text-white">{data.brand || 'None provided'}</dd>
                </div>
                <div>
                  <dt className="text-[#707070]">Domain / Hosting</dt>
                  <dd className="mt-1 font-medium text-white">{data.hosting || 'None provided'}</dd>
                </div>
                <div>
                  <dt className="text-[#707070]">Preferred Call Time</dt>
                  <dd className="mt-1 font-medium text-white">{data.callTime}</dd>
                </div>
                <div>
                  <dt className="text-[#707070]">Referral Source</dt>
                  <dd className="mt-1 font-medium text-white">{data.heard}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* ── Navigation Buttons (Back / Next / Submit) ─────────────── */}
        <div className="mt-12 flex items-center justify-between border-t border-white/[0.08] pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[#141414] px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.04] disabled:opacity-40"
            >
              <ArrowLeft className="size-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#141414] transition-opacity hover:opacity-90"
            >
              <span>Next</span>
              <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#141414] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Submitting onboarding…</span>
                </>
              ) : (
                <>
                  <span>Submit onboarding</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
