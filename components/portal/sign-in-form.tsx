'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSignIn } from '@clerk/nextjs'
import {
  noteSignInFailure,
  noteSignInSuccess,
  preSignInCheck,
} from '@/app/(portal)/auth-actions'

const fieldClass =
  'h-14 w-full rounded-[12px] border border-[#141414]/20 bg-white px-5 text-base text-[#141414] outline-none transition-colors placeholder:text-[#8A857C]/80 focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/15'
const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A857C]'
const submitClass =
  'inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-[#141414] px-6 text-base font-medium text-[#F6F5F0] transition-colors hover:bg-[#141414]/90 active:scale-[0.99] disabled:opacity-60'

export default function SignInForm() {
  const { signIn } = useSignIn()
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setBusy(true)
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '')
      .trim()
      .toLowerCase()
    const password = String(formData.get('password') ?? '')

    try {
      const gate = await preSignInCheck({ email })
      if (!gate.ok) {
        setMessage(gate.message)
        return
      }

      const { error } = await signIn.password({ identifier: email, password })
      if (error) {
        const { locked } = await noteSignInFailure({ email })
        setMessage(
          locked
            ? 'Account temporarily locked after repeated failed sign-ins. Our team has been notified.'
            : (error.longMessage ?? error.message ?? 'Incorrect email or password.')
        )
        return
      }

      if (signIn.status !== 'complete') {
        setMessage(
          'This account needs an additional verification step that is not available here. Please contact us and we will help.'
        )
        return
      }

      await noteSignInSuccess({ email })
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          window.location.href = decorateUrl('/continue')
        },
      })
    } catch {
      setMessage('Something went wrong while signing in. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="signin-email" className={labelClass}>
          Email address
        </label>
        <input
          id="signin-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label htmlFor="signin-password" className={labelClass}>
          Password
        </label>
        <input
          id="signin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={fieldClass}
          placeholder="Your password"
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
        {busy ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-[13px] text-[#5C5A55]">
        <Link href="/reset-password" className="underline-offset-4 hover:underline">
          Forgot password?
        </Link>
        <span className="mx-2 text-[#141414]/30">·</span>
        <Link href="/start" className="underline-offset-4 hover:underline">
          New here? Start a project
        </Link>
      </p>
    </form>
  )
}
