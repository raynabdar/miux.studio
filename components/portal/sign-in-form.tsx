'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSignIn } from '@clerk/nextjs'
import { Turnstile } from '@marsidev/react-turnstile'
import {
  noteSignInFailure,
  noteSignInSuccess,
  preSignInCheck,
  verifyAuthChallenge,
} from '@/app/(portal)/auth-actions'

const fieldClass =
  'w-full rounded-2xl border border-[#141414]/12 bg-white/70 px-4 py-3 text-sm text-[#141414] outline-none transition-all placeholder:text-[#8A857C] focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/20'

export default function SignInForm({ siteKey }: { siteKey: string | null }) {
  const { signIn } = useSignIn()
  const [token, setToken] = useState('')
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
      if (!(await verifyAuthChallenge(token))) {
        setMessage('Please complete the verification challenge.')
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
        <label htmlFor="signin-email" className="mb-1.5 block text-xs font-medium text-[#5C5A55]">
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
        <label
          htmlFor="signin-password"
          className="mb-1.5 block text-xs font-medium text-[#5C5A55]"
        >
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
        {busy ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-xs text-[#5C5A55]">
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
