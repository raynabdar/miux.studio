'use client'

import { useState, useTransition } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { BUDGET_RANGES, PROJECT_TYPES } from '@/lib/schemas'
import { acknowledgeMeeting, submitOnboarding } from '@/app/start/actions'

export type ExistingSubmission = {
  referenceId: string
  meetingPreference: 'yes' | 'no'
  acknowledged: boolean
}

type Props = {
  siteKey: string | null
  meetingUrl: string
  existing: ExistingSubmission | null
  earlySignUpEnabled: boolean
}

const fieldClass =
  'w-full rounded-2xl border border-[#141414]/12 bg-white/70 px-4 py-3 text-sm text-[#141414] outline-none transition-all placeholder:text-[#8A857C] focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20'

const labelClass = 'mb-1.5 block text-xs font-medium text-[#5C5A55]'

function Progress({ current }: { current: 0 | 1 | 2 }) {
  const steps = ['Project', 'Meeting', 'Account']
  return (
    <ol className="mb-8 flex items-center gap-2" aria-label="Onboarding progress">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-2">
          <span
            className={
              index <= current
                ? 'flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-[11px] font-semibold text-white'
                : 'flex h-6 w-6 items-center justify-center rounded-full border border-[#141414]/15 text-[11px] font-semibold text-[#8A857C]'
            }
          >
            {index + 1}
          </span>
          <span
            className={
              index <= current ? 'text-xs font-medium text-[#141414]' : 'text-xs text-[#8A857C]'
            }
          >
            {step}
          </span>
          {index < steps.length - 1 && (
            <span className="ml-1 h-px w-6 bg-[#141414]/15 sm:w-10" aria-hidden="true" />
          )}
        </li>
      ))}
    </ol>
  )
}

export default function StartWizard({ siteKey, meetingUrl, existing, earlySignUpEnabled }: Props) {
  const [submission, setSubmission] = useState<ExistingSubmission | null>(existing)
  const [acknowledged, setAcknowledged] = useState(existing?.acknowledged ?? false)
  const [token, setToken] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [ackPending, setAckPending] = useState(false)

  const accountUnlocked = Boolean(submission) && (acknowledged || earlySignUpEnabled)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)
    const payload = {
      fullName: String(formData.get('fullName') ?? ''),
      email: String(formData.get('email') ?? ''),
      company: String(formData.get('company') ?? ''),
      service: String(formData.get('service') ?? ''),
      budgetRange: String(formData.get('budgetRange') ?? ''),
      message: String(formData.get('message') ?? ''),
      meetingPreference: String(formData.get('meetingPreference') ?? ''),
      turnstileToken: token,
    }

    startTransition(async () => {
      const result = await submitOnboarding(payload)
      if (!result.ok) {
        setError(result.message)
        return
      }
      setSubmission({
        referenceId: result.referenceId,
        meetingPreference: result.meetingPreference,
        acknowledged: false,
      })
      setAcknowledged(false)
    })
  }

  function handleAcknowledge() {
    if (!submission) return
    setAckPending(true)
    setError(null)
    acknowledgeMeeting({ referenceId: submission.referenceId })
      .then((result) => {
        if (!result.ok) {
          setError(result.message ?? 'Could not save the confirmation. Please try again.')
          return
        }
        setAcknowledged(true)
      })
      .finally(() => setAckPending(false))
  }

  const currentStep: 0 | 1 | 2 = !submission ? 0 : acknowledged ? 2 : 1

  if (submission && submission.meetingPreference === 'no') {
    return (
      <div className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 shadow-[0_18px_50px_-30px_rgba(20,20,20,0.25)] backdrop-blur-xl sm:p-8">
        <Progress current={1} />
        <h2 className="mb-2 text-xl tracking-tight">Thank you — we have your request.</h2>
        <p className="mb-4 text-sm leading-relaxed text-[#5C5A55]">
          Your reference is{' '}
          <span className="rounded-md bg-[#F6F5F0] px-1.5 py-0.5 font-mono text-[13px] text-[#141414]">
            {submission.referenceId}
          </span>
          . Our team will contact you by email to discuss the next step.
        </p>
        <p className="text-xs text-[#8A857C]">
          No account is created at this stage. If you would like to meet first, reply to our
          email and we will arrange it.
        </p>
      </div>
    )
  }

  if (submission && submission.meetingPreference === 'yes') {
    return (
      <div className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 shadow-[0_18px_50px_-30px_rgba(20,20,20,0.25)] backdrop-blur-xl sm:p-8">
        <Progress current={currentStep} />
        <h2 className="mb-2 text-xl tracking-tight">Your request is saved.</h2>
        <p className="mb-5 text-sm leading-relaxed text-[#5C5A55]">
          Reference{' '}
          <span className="rounded-md bg-[#F6F5F0] px-1.5 py-0.5 font-mono text-[13px] text-[#141414]">
            {submission.referenceId}
          </span>
          . Book a time that works for you, then confirm the meeting step below to unlock account
          creation.
        </p>

        <a
          href={meetingUrl}
          target="_blank"
          rel="noreferrer"
          className="mb-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(234,88,12,0.28)] transition-all hover:brightness-105 active:scale-[0.98]"
        >
          Book a Meeting
        </a>

        {!acknowledged && (
          <div className="mb-5 rounded-2xl border border-[#141414]/10 bg-[#F6F5F0]/80 p-4">
            <p className="mb-3 text-xs leading-relaxed text-[#5C5A55]">
              A page visit alone is not treated as proof of a meeting. Once you have booked or
              completed it, confirm here.
            </p>
            <button
              type="button"
              onClick={handleAcknowledge}
              disabled={ackPending}
              className="inline-flex items-center justify-center rounded-full border border-[#141414]/15 bg-white px-4 py-2 text-xs font-semibold text-[#141414] transition-all hover:border-orange-500/50 disabled:opacity-60"
            >
              {ackPending ? 'Saving…' : "I've completed the meeting"}
            </button>
          </div>
        )}

        {error && (
          <p role="alert" className="mb-4 text-xs text-red-600">
            {error}
          </p>
        )}

        {accountUnlocked ? (
          <div>
            <p className="mb-3 text-xs text-[#5C5A55]">
              You can now create your account to follow the project in one place.
            </p>
            <a
              href={`/sign-up?ref=${encodeURIComponent(submission.referenceId)}`}
              className="inline-flex items-center justify-center rounded-full bg-[#141414] px-5 py-2.5 text-sm font-semibold text-[#F6F5F0] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Create Your Account
            </a>
          </div>
        ) : (
          <p className="text-xs text-[#8A857C]">
            Account creation unlocks after the meeting step is completed or acknowledged.
          </p>
        )}
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 shadow-[0_18px_50px_-30px_rgba(20,20,20,0.25)] backdrop-blur-xl sm:p-8"
    >
      <Progress current={0} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            className={fieldClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className={fieldClass}
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>
            Company or organization
          </label>
          <input
            id="company"
            name="company"
            required
            minLength={2}
            maxLength={160}
            autoComplete="organization"
            className={fieldClass}
            placeholder="Company name"
          />
        </div>
        <div>
          <label htmlFor="service" className={labelClass}>
            Service of interest
          </label>
          <select id="service" name="service" required className={fieldClass} defaultValue="">
            <option value="" disabled>
              Select a service
            </option>
            {PROJECT_TYPES.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="budgetRange" className={labelClass}>
            Budget range
          </label>
          <select
            id="budgetRange"
            name="budgetRange"
            required
            className={fieldClass}
            defaultValue=""
          >
            <option value="" disabled>
              Select a budget range
            </option>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            Short project description
          </label>
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={4}
            className={`${fieldClass} resize-y`}
            placeholder="What are you building, and what does success look like?"
          />
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-medium text-[#141414]">
          Are you open to a meeting with our team?
        </legend>
        <div className="flex gap-3">
          {(['yes', 'no'] as const).map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-[#141414]/15 bg-white/70 px-4 py-2 text-sm transition-all has-[:checked]:border-orange-500/60 has-[:checked]:bg-orange-500/10"
            >
              <input
                type="radio"
                name="meetingPreference"
                value={value}
                required
                className="accent-orange-600"
              />
              {value === 'yes' ? 'Yes' : 'No'}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        {siteKey ? (
          <Turnstile
            siteKey={siteKey}
            options={{ theme: 'light' }}
            onSuccess={(value) => setToken(value)}
            onExpire={() => setToken('')}
            onError={() => setToken('')}
          />
        ) : (
          <p className="rounded-xl border border-dashed border-[#141414]/20 px-3 py-2 text-[11px] text-[#8A857C]">
            Verification challenge is not configured in this environment.
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-xs text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-[#141414] px-6 py-3 text-sm font-semibold text-[#F6F5F0] transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? 'Saving…' : 'Continue'}
      </button>
      <p className="mt-3 text-[11px] leading-relaxed text-[#8A857C]">
        By submitting you agree to be contacted about your request. No account is created at this
        stage.
      </p>
    </form>
  )
}
