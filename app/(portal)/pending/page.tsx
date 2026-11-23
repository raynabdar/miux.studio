import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { currentDbUser } from '@/lib/auth/session'
import { ROLE_HOME } from '@/lib/auth/routes'
import SignOutButton from '@/components/portal/sign-out-button'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Account Status — Miux Studio',
  robots: { index: false, follow: false },
}

export default async function PendingPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await currentDbUser()
  if (user?.status === 'active') redirect(ROLE_HOME[user.role])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-12">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A857C]">
        Account status
      </p>
      <h1 className="mb-2 text-2xl tracking-tight sm:text-3xl">
        {user ? 'Almost there.' : 'Finalizing your account.'}
      </h1>

      {!user && (
        <p className="mb-6 text-sm leading-relaxed text-[#5C5A55]">
          Your sign-up is being linked to our system. This usually takes a few seconds — refresh
          this page in a moment.
        </p>
      )}

      {user && user.status === 'suspended' && (
        <p className="mb-6 text-sm leading-relaxed text-[#5C5A55]">
          This account is suspended. Please contact{' '}
          <a href="mailto:hello@miux.studio" className="underline underline-offset-4">
            hello@miux.studio
          </a>{' '}
          and our team will help.
        </p>
      )}

      {user && user.status === 'pending_verification' && (
        <div className="mb-6 space-y-3 rounded-3xl border border-[#141414]/10 bg-white/70 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#5C5A55]">Email verified</span>
            <span className="font-medium">{user.emailVerifiedAt ? 'Yes' : 'Pending'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#5C5A55]">Team review</span>
            <span className="font-medium">{user.ownerVerifiedAt ? 'Approved' : 'Pending'}</span>
          </div>
          <p className="pt-1 text-xs leading-relaxed text-[#8A857C]">
            Dashboard access unlocks once both checks are complete. We usually review accounts
            within one business day.
          </p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <SignOutButton />
        <a
          href="mailto:hello@miux.studio"
          className="text-xs text-[#5C5A55] underline-offset-4 hover:text-[#141414] hover:underline"
        >
          Contact the team
        </a>
      </div>
    </main>
  )
}
