import type { Metadata } from 'next'
import Link from 'next/link'
import AuthShell from '@/components/portal/auth-shell'
import SignUpForm from '@/components/portal/sign-up-form'
import { getSignUpGate } from '@/lib/onboarding/submission'
import { getTurnstileSiteKey } from '@/lib/security/turnstile'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Create Your Account — Miux Studio',
  robots: { index: false, follow: false },
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const params = await searchParams
  const referenceId = typeof params.ref === 'string' ? params.ref : undefined
  const gate = await getSignUpGate(referenceId)

  if (!gate.allowed || !gate.submission) {
    return (
      <AuthShell
        title="Account creation is locked"
        subtitle="Accounts are created after your meeting step is completed, or when the owner enables early sign-up."
      >
        <p className="mb-4 text-sm leading-relaxed text-[#5C5A55]">
          {referenceId
            ? 'This reference is not currently eligible for account creation.'
            : 'Start with a project request first — you will receive a reference ID and a meeting step.'}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={referenceId ? `/start?ref=${encodeURIComponent(referenceId)}` : '/start'}
            className="inline-flex items-center justify-center rounded-full bg-[#141414] px-5 py-2.5 text-sm font-semibold text-[#F6F5F0] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Continue onboarding
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-full border border-[#141414]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#141414] transition-all hover:border-orange-500/50"
          >
            I already have an account
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle={`Reference ${gate.submission.referenceId}. Use the same email address you used in the project request.`}
    >
      <SignUpForm
        siteKey={getTurnstileSiteKey()}
        email={gate.submission.email}
      />
    </AuthShell>
  )
}
