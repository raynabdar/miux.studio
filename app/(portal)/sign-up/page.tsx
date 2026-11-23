import type { Metadata } from 'next'
import Link from 'next/link'
import AuthShell from '@/components/portal/auth-shell'
import SignUpForm from '@/components/portal/sign-up-form'
import { getSignUpGate } from '@/lib/onboarding/submission'

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
            className="inline-flex h-12 items-center justify-center rounded-[12px] bg-[#141414] px-6 text-sm font-medium text-[#F6F5F0] transition-colors hover:bg-[#141414]/90 active:scale-[0.99]"
          >
            Continue onboarding
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[#141414]/20 bg-white px-6 text-sm font-medium text-[#141414] transition-colors hover:border-orange-500/50"
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
      <SignUpForm email={gate.submission.email} />
    </AuthShell>
  )
}
