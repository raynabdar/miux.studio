import type { Metadata } from 'next'
import { requireActiveUser } from '@/lib/auth/session'
import { chooseNavigationPreference } from './actions'

export const metadata: Metadata = {
  title: 'Continue — Miux Studio',
  robots: { index: false, follow: false },
}

export default async function ContinuePage() {
  const user = await requireActiveUser()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-12">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A857C]">
        Signed in as {user.email}
      </p>
      <h1 className="mb-2 text-2xl tracking-tight sm:text-3xl">How would you like to continue?</h1>
      <p className="mb-6 text-sm leading-relaxed text-[#5C5A55]">
        This only sets your preferred workspace. Your access is decided by the role stored on your
        account.
      </p>

      <form action={chooseNavigationPreference} className="space-y-3">
        <button
          type="submit"
          name="preference"
          value="client"
          className="w-full rounded-3xl border border-[#141414]/10 bg-white/70 p-5 text-left transition-all hover:border-orange-500/50 hover:shadow-[0_18px_50px_-30px_rgba(20,20,20,0.25)]"
        >
          <span className="block text-base font-semibold">I&apos;m a Client</span>
          <span className="mt-1 block text-xs text-[#5C5A55]">
            Follow your projects, updates and conversations.
          </span>
        </button>
        <button
          type="submit"
          name="preference"
          value="team_member"
          className="w-full rounded-3xl border border-[#141414]/10 bg-white/70 p-5 text-left transition-all hover:border-orange-500/50 hover:shadow-[0_18px_50px_-30px_rgba(20,20,20,0.25)]"
        >
          <span className="block text-base font-semibold">I&apos;m a Team Member</span>
          <span className="mt-1 block text-xs text-[#5C5A55]">
            Work on client projects and studio operations.
          </span>
        </button>
      </form>
    </main>
  )
}
