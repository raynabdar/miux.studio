import type { Metadata } from 'next'
import Link from 'next/link'
import { requirePageRole, isFounder } from '@/lib/auth/session'
import DemoModeBanner from '@/components/portal/demo-banner'
import SignOutButton from '@/components/portal/sign-out-button'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Team Workspace — Miux Studio',
  robots: { index: false, follow: false },
}

export default async function TeamDashboardPage() {
  const user = await requirePageRole('team_member')
  const founder = isFounder(user.clerkId)

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      {user.isDemo && <DemoModeBanner label="the team workspace" />}

      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A857C]">
            Team workspace
          </p>
          <h1 className="mt-1 text-2xl tracking-tight sm:text-3xl">
            Welcome, {user.fullName ?? user.email}
          </h1>
        </div>
        <SignOutButton />
      </header>

      <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
        <h2 className="mb-2 text-base font-semibold">Team tools are on the way</h2>
        <p className="text-sm leading-relaxed text-[#5C5A55]">
          Your team role is active and enforced server-side. Project updates, client management and
          operations tooling arrive in Phase 2 and 3.
        </p>

        {founder ? (
          <Link
            href="/founder"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#141414] px-5 py-2.5 text-sm font-semibold text-[#F6F5F0] transition-transform hover:-translate-y-0.5"
          >
            Open founder panel
          </Link>
        ) : (
          <p className="mt-5 text-xs text-[#8A857C]">
            Founder-level settings are not visible to team members.
          </p>
        )}
      </section>
    </main>
  )
}
