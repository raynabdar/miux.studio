'use client'

import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { Turnstile } from '@marsidev/react-turnstile'
import { checkSignUpEmail, verifyAuthChallenge } from '@/app/(portal)/auth-actions'

const fieldClass =
  'w-full rounded-2xl border border-[#141414]/12 bg-white/70 px-4 py-3 text-sm text-[#141414] outline-none transition-all placeholder:text-[#8A857C] focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20'

export default function SignUpForm({
  siteKey,
  email,
}: {
  siteKey: string | null
  email: string
}) {
  const { signUp } = useSignUp()
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [token, setToken] = useState('')
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
      if (!(await verifyAuthChallenge(token))) {
        setMessage('Please complete the verification challenge.')
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
          <label htmlFor="code" className="mb-1.5 block text-xs font-medium text-[#5C5A55]">
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
          className="inline-flex w-full items-center justify-center rounded-full bg-[#141414] px-6 py-3 text-sm font-semibold text-[#F6F5F0] transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
        >
          {busy ? 'Verifying…' : 'Verify and continue'}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      <div>
        <label htmlFor="signup-email" className="mb-1.5 block text-xs font-medium text-[#5C5A55]">
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
        <label
          htmlFor="signup-password"
          className="mb-1.5 block text-xs font-medium text-[#5C5A55]"
        >
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

      {siteKey && (
        <Turnstile
          siteKey={siteKey}
          options={{ theme: 'light' }}
          onSuccess={(value) => setToken(value)}
          onExpire={() => setToken('')}
          onError={() => setToken('')}
        />
      )}

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
        {busy ? 'Creating account…' : 'Create account'}
      </button>
      <p className="text-[11px] leading-relaxed text-[#8A857C]">
        Your account starts as pending verification. Access unlocks after email verification and a
        quick review by our team.
      </p>
    </form>
  )
}
