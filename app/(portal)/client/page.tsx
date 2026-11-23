import type { Metadata } from 'next'
import Link from 'next/link'
import { requirePageRole } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'
import DemoModeBanner from '@/components/portal/demo-banner'
import SignOutButton from '@/components/portal/sign-out-button'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Client Dashboard — Miux Studio',
  robots: { index: false, follow: false },
}

export default async function ClientDashboardPage() {
  const user = await requirePageRole('client')

  const submission = await getDb().onboardingSubmission.findFirst({
    where: { clerkUserId: user.clerkId },
    orderBy: { createdAt: 'desc' },
    select: { referenceId: true, meetingPreference: true, status: true },
  })

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      {user.isDemo && <DemoModeBanner label="the client dashboard" />}

      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A857C]">
            Client workspace
          </p>
          <h1 className="mt-1 text-2xl tracking-tight sm:text-3xl">Welcome, {user.fullName ?? user.email}</h1>
        </div>
        <SignOutButton />
      </header>

      <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
        <h2 className="mb-2 text-base font-semibold">Your project space is being prepared</h2>
        <p className="text-sm leading-relaxed text-[#5C5A55]">
          The authentication foundation is live: your account is verified and secured. Project
          timelines, updates, messaging and the AI assistant arrive in the next phase — until then,
          email us any time.
        </p>
        {submission && (
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-2xl bg-[#F6F5F0] px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8A857C]">Reference</dt>
              <dd className="mt-1 font-mono text-[13px]">{submission.referenceId}</dd>
            </div>
            <div className="rounded-2xl bg-[#F6F5F0] px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8A857C]">Onboarding</dt>
              <dd className="mt-1 capitalize">{submission.status.replaceAll('_', ' ')}</dd>
            </div>
          </dl>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[#141414] px-5 py-2.5 text-sm font-semibold text-[#F6F5F0] transition-transform hover:-translate-y-0.5"
          >
            Contact the team
          </Link>
          <Link
            href="/meeting"
            className="inline-flex items-center justify-center rounded-full border border-[#141414]/15 bg-white px-5 py-2.5 text-sm font-semibold transition-all hover:border-orange-500/50"
          >
            Book a meeting
          </Link>
        </div>
      </section>
    </main>
  )
}
