'use client'

import { useState } from 'react'
import { ArrowUpRight, Loader2 } from 'lucide-react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function TeardownForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setStatus('submitting')
    setMessage('')

    try {
      const response = await fetch('/api/teardown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          website: data.get('website'),
          notes: data.get('notes'),
          company: data.get('company'),
        }),
      })

      const payload = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        setStatus('error')
        setMessage(payload?.error ?? 'Something went wrong. Please try again.')
        return
      }

      setStatus('success')
      setMessage('Request received. We will send the teardown within two working days.')
      form.reset()
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  const fieldClass =
    'mt-2 w-full rounded-xl border border-[#141414]/[0.14] bg-white px-4 py-3 text-sm text-[#141414] placeholder:text-[#78756E] transition-colors focus:border-orange-500/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500'

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="teardown-name" className="text-xs font-medium uppercase tracking-[0.14em] text-[#5C5A55]">
            Your name
          </label>
          <input
            id="teardown-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={100}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="teardown-email" className="text-xs font-medium uppercase tracking-[0.14em] text-[#5C5A55]">
            Email
          </label>
          <input
            id="teardown-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="teardown-website" className="text-xs font-medium uppercase tracking-[0.14em] text-[#5C5A55]">
          Website to review
        </label>
        <input
          id="teardown-website"
          name="website"
          type="text"
          inputMode="url"
          required
          placeholder="yourdomain.com"
          maxLength={300}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="teardown-notes" className="text-xs font-medium uppercase tracking-[0.14em] text-[#5C5A55]">
          Anything specific? <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          id="teardown-notes"
          name="notes"
          rows={4}
          maxLength={1000}
          placeholder="Conversion, positioning, speed, mobile — tell us what to focus on."
          className={fieldClass}
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="teardown-company">Company</label>
        <input id="teardown-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#141414] px-7 py-3.5 text-sm font-semibold text-[#F6F5F0] transition-colors hover:bg-[#262626] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141414] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Sending
          </>
        ) : (
          <>
            Request the teardown
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </>
        )}
      </button>

      <p
        aria-live="polite"
        className={`text-sm ${status === 'error' ? 'text-orange-600' : 'text-[#5C5A55]'}`}
      >
        {message}
      </p>
    </form>
  )
}
