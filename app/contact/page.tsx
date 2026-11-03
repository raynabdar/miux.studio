'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Navbar, Footer } from '@/components/site-shell'
import { MagneticButton } from '@/components/magnetic-button'

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
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
  message: z.string().min(10, 'Please share at least 10 characters about your project'),
  website: z.string().optional(), // Honeypot field
})

type ContactFormValues = z.infer<typeof contactSchema>

const PROJECT_TYPES = [
  'Brand Design and Identity',
  'Web Design',
  'Web Development',
  'UI/UX Design',
  'Ads and Campaigns',
  'Other',
] as const

const BUDGET_RANGES = [
  'Under $5,000',
  '$5,000 – $10,000',
  '$10,000 – $25,000',
  '$25,000 – $50,000',
  '$50,000+',
] as const

export default function ContactPage() {
  const [serverStatus, setServerStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      projectType: 'Brand Design and Identity',
      budget: '',
      message: '',
      website: '',
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    setServerStatus({ type: null, message: '' })
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const resData = await response.json()

      if (!response.ok) {
        setServerStatus({
          type: 'error',
          message:
            resData.error ||
            'Something went wrong while sending your enquiry. Please email hello@miux.studio directly.',
        })
        return
      }

      reset()
      setServerStatus({
        type: 'success',
        message:
          'Thank you. Your enquiry has been received. We reply within one business day.',
      })
    } catch {
      setServerStatus({
        type: 'error',
        message:
          'Unable to submit the form at this moment. Please email hello@miux.studio directly.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />

      <main className="px-5 pb-28 pt-36 sm:pt-44">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-16 lg:grid-cols-[1.3fr_0.7fr]">
            {/* Form Column */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#707070]">
                Initiate Conversation
              </p>
              <h1 className="mt-4 text-5xl font-semibold tracking-[-0.07em] sm:text-7xl">
                Contact
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#A3A3A3] sm:text-lg">
                Tell us what you are looking to build, reposition, or accelerate.
              </p>

              {/* Status Banner */}
              {serverStatus.message && (
                <div
                  role="status"
                  className={`mt-8 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                    serverStatus.type === 'success'
                      ? 'border-white/30 bg-white/[0.06] text-white'
                      : 'border-white/20 bg-white/[0.03] text-[#A3A3A3]'
                  }`}
                >
                  {serverStatus.type === 'success' ? (
                    <CheckCircle2 className="size-5 shrink-0 text-white" />
                  ) : (
                    <AlertCircle className="size-5 shrink-0 text-[#A3A3A3]" />
                  )}
                  <p className="leading-relaxed">{serverStatus.message}</p>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="mt-10 grid gap-6 sm:grid-cols-2"
              >
                {/* Honeypot field for spam prevention */}
                <input
                  {...register('website')}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {/* Full name (Floating Label) */}
                <div className="relative">
                  <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50 focus-within:bg-white/[0.05]">
                    <input
                      id="name"
                      {...register('name')}
                      type="text"
                      placeholder=" "
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                    />
                    <label
                      htmlFor="name"
                      className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                    >
                      Full name
                    </label>
                    {/* Animated bottom focus border */}
                    <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
                  </div>
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-xs text-[#A3A3A3]">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email (Floating Label) */}
                <div className="relative">
                  <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50 focus-within:bg-white/[0.05]">
                    <input
                      id="email"
                      {...register('email')}
                      type="email"
                      placeholder=" "
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                    />
                    <label
                      htmlFor="email"
                      className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                    >
                      Email
                    </label>
                    <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-xs text-[#A3A3A3]">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Company (optional) */}
                <div className="relative sm:col-span-2">
                  <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50 focus-within:bg-white/[0.05]">
                    <input
                      id="company"
                      {...register('company')}
                      type="text"
                      placeholder=" "
                      className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none"
                    />
                    <label
                      htmlFor="company"
                      className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                    >
                      Company (optional)
                    </label>
                    <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
                  </div>
                </div>

                {/* Project type (select) */}
                <div className="relative">
                  <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50 focus-within:bg-white/[0.05]">
                    <label
                      htmlFor="projectType"
                      className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070]"
                    >
                      Project type
                    </label>
                    <select
                      id="projectType"
                      {...register('projectType')}
                      className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none [&>option]:bg-[#1A1A1A] [&>option]:text-white cursor-pointer"
                    >
                      {PROJECT_TYPES.map((pt) => (
                        <option key={pt} value={pt}>
                          {pt}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
                  </div>
                  {errors.projectType && (
                    <p className="mt-1.5 text-xs text-[#A3A3A3]">
                      {errors.projectType.message}
                    </p>
                  )}
                </div>

                {/* Budget range (select) */}
                <div className="relative">
                  <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50 focus-within:bg-white/[0.05]">
                    <label
                      htmlFor="budget"
                      className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070]"
                    >
                      Budget range
                    </label>
                    <select
                      id="budget"
                      {...register('budget')}
                      className="peer w-full rounded-xl bg-transparent px-4 pb-2.5 pt-6 text-sm text-white outline-none [&>option]:bg-[#1A1A1A] [&>option]:text-white cursor-pointer"
                    >
                      <option value="">Select a range</option>
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
                  </div>
                  {errors.budget && (
                    <p className="mt-1.5 text-xs text-[#A3A3A3]">
                      {errors.budget.message}
                    </p>
                  )}
                </div>

                {/* Message (Floating Label) */}
                <div className="relative sm:col-span-2">
                  <div className="relative rounded-xl border border-white/[0.12] bg-white/[0.03] transition-colors focus-within:border-white/50 focus-within:bg-white/[0.05]">
                    <textarea
                      id="message"
                      {...register('message')}
                      rows={5}
                      placeholder=" "
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      className="peer w-full resize-none rounded-xl bg-transparent px-4 pb-3 pt-6 text-sm text-white outline-none"
                    />
                    <label
                      htmlFor="message"
                      className="pointer-events-none absolute left-4 top-2 text-[10px] font-medium tracking-wide uppercase text-[#707070] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:text-[#707070] peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-white"
                    >
                      Message
                    </label>
                    <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 bg-white transition-transform duration-300 peer-focus:scale-x-100" />
                  </div>
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-xs text-[#A3A3A3]">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="sm:col-span-2 mt-2">
                  <MagneticButton
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                    className="px-8 py-3.5 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Sending…</span>
                      </>
                    ) : (
                      <>
                        <span>Send enquiry</span>
                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </MagneticButton>
                </div>
              </form>
            </div>

            {/* Info Block Column */}
            <aside className="self-start rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 lg:mt-24">
              <h2 className="text-xs uppercase tracking-[0.25em] text-[#707070]">
                Direct Contact
              </h2>

              <div className="mt-6 space-y-6 text-sm">
                <div>
                  <p className="text-xs text-[#707070]">Email</p>
                  <a
                    href="mailto:hello@miux.studio"
                    className="animated-link mt-1 text-base font-medium text-white"
                  >
                    hello@miux.studio
                  </a>
                </div>

                <div>
                  <p className="text-xs text-[#707070]">Response Time</p>
                  <p className="mt-1 text-white/90">
                    We reply within one business day.
                  </p>
                </div>

                <div className="border-t border-white/[0.08] pt-6">
                  <p className="text-xs text-[#707070]">Regional Scope</p>
                  <p className="mt-1 font-medium text-white">
                    Serving Asia and the UAE
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#A3A3A3]">
                    Working with select brands across Dubai, Abu Dhabi, Singapore, Hong Kong, and across the Asian continent.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
