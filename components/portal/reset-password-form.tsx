'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSignIn } from '@clerk/nextjs'
import { checkPasswordResetLimit } from '@/app/(portal)/auth-actions'

const fieldClass =
  'w-full rounded-2xl border border-[#141414]/12 bg-white/70 px-4 py-3 text-sm text-[#141414] outline-none transition-all placeholder:text-[#8A857C] focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20'

type Step = 'request' | 'verify' | 'password'

export default function ResetPasswordForm() {
  const { signIn } = useSignIn()
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function requestCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setBusy(true)
    const formData = new FormData(event.currentTarget)
    const nextEmail = String(formData.get('email') ?? '')
      .trim()
      .toLowerCase()
    try {
      const limit = await checkPasswordResetLimit({ email: nextEmail })
      if (!limit.ok) {
        setMessage(limit.message ?? 'Please try again later.')
        return
      }
      const created = await signIn.create({ identifier: nextEmail })
      if (created.error) {
        setMessage(created.error.longMessage ?? created.error.message ?? 'Could not start the reset.')
        return
      }
      const { error } = await signIn.resetPasswordEmailCode.sendCode()
      if (error) {
        setMessage(error.longMessage ?? error.message ?? 'Could not send the reset code.')
        return
      }
      setEmail(nextEmail)
      setStep('verify')
    } catch {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setBusy(true)
    try {
      const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code })
      if (error) {
        setMessage(error.longMessage ?? error.message ?? 'That code did not work.')
        return
      }
      setStep('password')
    } catch {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setBusy(true)
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password') ?? '')
    try {
      const { error } = await signIn.resetPasswordEmailCode.submitPassword({ password })
      if (error) {
        setMessage(error.longMessage ?? error.message ?? 'Could not update the password.')
        return
      }
      if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            window.location.href = decorateUrl('/continue')
          },
        })
        return
      }
      setMessage('Your password was updated. Please sign in.')
      setStep('request')
    } catch {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      {step === 'request' && (
        <form onSubmit={requestCode} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="mb-1.5 block text-xs font-medium text-[#5C5A55]">
              Email address
            </label>
            <input
              id="reset-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={fieldClass}
              placeholder="you@company.com"
            />
          </div>
          {message && (
            <p role="alert" className="text-xs text-red-600">
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#141414] px-6 py-3 text-sm font-semibold text-[#F6F5F0] transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? 'Sending…' : 'Send reset code'}
          </button>
        </form>
      )}

      {step === 'verify' && (
        <form onSubmit={verifyCode} className="space-y-4">
          <p className="text-sm leading-relaxed text-[#5C5A55]">
            We sent a reset code to <span className="font-medium text-[#141414]">{email}</span>.
          </p>
          <div>
            <label htmlFor="reset-code" className="mb-1.5 block text-xs font-medium text-[#5C5A55]">
              Reset code
            </label>
            <input
              id="reset-code"
              inputMode="numeric"
              required
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className={fieldClass}
              placeholder="Enter the code"
            />
          </div>
          {message && (
            <p role="alert" className="text-xs text-red-600">
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#141414] px-6 py-3 text-sm font-semibold text-[#F6F5F0] transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? 'Verifying…' : 'Verify code'}
          </button>
        </form>
      )}

      {step === 'password' && (
        <form onSubmit={submitPassword} className="space-y-4">
          <div>
            <label
              htmlFor="reset-password"
              className="mb-1.5 block text-xs font-medium text-[#5C5A55]"
            >
              New password
            </label>
            <input
              id="reset-password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className={fieldClass}
              placeholder="At least 8 characters"
            />
          </div>
          {message && (
            <p role="alert" className="text-xs text-red-600">
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#141414] px-6 py-3 text-sm font-semibold text-[#F6F5F0] transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? 'Updating…' : 'Update password'}
          </button>
        </form>
      )}

      <p className="text-center text-xs text-[#5C5A55]">
        <Link href="/sign-in" className="underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
