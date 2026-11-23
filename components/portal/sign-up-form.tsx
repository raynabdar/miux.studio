'use client'

import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { checkSignUpEmail } from '@/app/(portal)/auth-actions'

const fieldClass =
  'h-14 w-full rounded-[12px] border border-[#141414]/20 bg-white px-5 text-base text-[#141414] outline-none transition-colors placeholder:text-[#8A857C]/80 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/15'
const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A857C]'
const submitClass =
  'inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-[#141414] px-6 text-base font-medium text-[#F6F5F0] transition-colors hover:bg-[#141414]/90 active:scale-[0.99] disabled:opacity-60'

export default function SignUpForm({ email }: { email: string }) {
  const { signUp } = useSignUp()
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [emailAddress, setEmailAddress] = useState(email)

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setBusy(true)
    const formData = new FormData(event.currentTarget)
    const nextEmail = String(formData.get('email') ?? '')
      .trim()
      .toLowerCase()
    const password = String(formData.get('password') ?? '')

    try {
      const emailCheck = await checkSignUpEmail({ email: nextEmail })
      if (!emailCheck.ok) {
        setMessage(emailCheck.message ?? 'Please check your email address.')
        return
      }

      const { error } = await signUp.password({
        emailAddress: nextEmail,
        password,
      })
      if (error) {
        setMessage(error.longMessage ?? error.message ?? 'Could not create the account.')
        return
      }

      if (signUp.status === 'complete') {
        await signUp.finalize({
          navigate: ({ decorateUrl }) => {
            window.location.href = decorateUrl('/continue')
          },
        })
        return
      }

      await signUp.verifications.sendEmailCode()
      setEmailAddress(nextEmail)
      setStep('verify')
    } catch {
      setMessage('Something went wrong while creating the account. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setBusy(true)
    const formData = new FormData(event.currentTarget)
    const code = String(formData.get('code') ?? '').trim()

    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code })
      if (error) {
        setMessage(error.longMessage ?? error.message ?? 'That code did not work.')
        return
      }
      if (signUp.status !== 'complete') {
        setMessage('Verification is not finished yet. Please enter the latest code.')
        return
      }
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          window.location.href = decorateUrl('/continue')
        },
      })
    } catch {
      setMessage('Something went wrong while verifying. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (step === 'verify') {
    return (
      <form onSubmit={handleVerify} className="space-y-4">
        <p className="text-sm leading-relaxed text-[#5C5A55]">
          We sent a verification code to <span className="font-medium text-[#141414]">{emailAddress}</span>
          . Enter it below to finish creating your account.
        </p>
        <div>
          <label htmlFor="code" className={labelClass}>
            Verification code
          </label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            required
            autoComplete="one-time-code"
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
          className={submitClass}
        >
          {busy ? 'Verifying…' : 'Verify and continue'}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      <div>
        <label htmlFor="signup-email" className={labelClass}>
          Email address
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          defaultValue={email}
          autoComplete="email"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="signup-password" className={labelClass}>
          Password
        </label>
        <input
          id="signup-password"
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
        className={submitClass}
      >
        {busy ? 'Creating account…' : 'Create account'}
      </button>
      <p className="text-[11px] leading-relaxed text-[#8A857C]">
        Your account starts as pending verification. Access unlocks after a quick review by our team.
      </p>
    </form>
  )
}
