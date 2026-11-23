import type { Metadata } from 'next'
import { requireFounder } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'
import { setAccountVerification, setEarlySignUp } from './actions'
import SignOutButton from '@/components/portal/sign-out-button'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Founder Panel — Miux Studio',
  robots: { index: false, follow: false },
}

const fmt = (date: Date | null) => (date ? date.toISOString().slice(0, 10) : '—')

export default async function FounderPage() {
  const { userId } = await requireFounder()

  const [settings, users, submissions, auditRows] = await Promise.all([
    getDb().applicationSettings.findUnique({ where: { id: 1 } }),
    getDb().user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 25,
      select: {
        clerkId: true,
        email: true,
        role: true,
        status: true,
        isDemo: true,
        emailVerifiedAt: true,
        ownerVerifiedAt: true,
        createdAt: true,
      },
    }),
    getDb().onboardingSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        referenceId: true,
        fullName: true,
        email: true,
        company: true,
        service: true,
        budgetRange: true,
        message: true,
        meetingPreference: true,
        bookingState: true,
        meetingAcknowledgedAt: true,
        status: true,
        createdAt: true,
      },
    }),
    getDb().auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 12,
      select: { action: true, actorRole: true, targetType: true, targetId: true, createdAt: true },
    }),
  ])

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A857C]">
            Founder panel
          </p>
          <h1 className="mt-1 text-2xl tracking-tight sm:text-3xl">Owner controls</h1>
          <p className="mt-1 text-xs text-[#8A857C]">
            Identity {userId} · every action below is written to the audit log.
          </p>
        </div>
        <SignOutButton />
      </header>

      <section className="mb-6 rounded-[28px] border border-[#141414]/10 bg-white/70 p-6">
        <h2 className="mb-2 text-base font-semibold">Onboarding settings</h2>
        <p className="mb-4 text-sm leading-relaxed text-[#5C5A55]">
          Early sign-up lets a client create an account right after the project request, before the
          meeting step. Off by default.
        </p>
        <form action={setEarlySignUp} className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="enabled"
              defaultChecked={settings?.earlySignUpEnabled ?? false}
              className="h-4 w-4 accent-orange-600"
            />
            Enable early sign-up
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-[#141414] px-4 py-2 text-xs font-semibold text-[#F6F5F0] transition-transform hover:-translate-y-0.5"
          >
            Save
          </button>
        </form>
      </section>

      <section className="mb-6 rounded-[28px] border border-[#141414]/10 bg-white/70 p-6">
        <h2 className="mb-4 text-base font-semibold">Accounts</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#141414]/10 text-[11px] uppercase tracking-[0.14em] text-[#8A857C]">
                <th className="py-2 pr-3 font-medium">Account</th>
                <th className="py-2 pr-3 font-medium">Role</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Email</th>
                <th className="py-2 pr-3 font-medium">Approved</th>
                <th className="py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((account) => (
                <tr key={account.clerkId} className="border-b border-[#141414]/5">
                  <td className="py-3 pr-3">
                    <span className="block">{account.email}</span>
                    <span className="text-[11px] text-[#8A857C]">
                      {account.isDemo ? 'demo · ' : ''}
                      joined {fmt(account.createdAt)}
                    </span>
                  </td>
                  <td className="py-3 pr-3 capitalize">{account.role.replace('_', ' ')}</td>
                  <td className="py-3 pr-3">
                    <span
                      className={
                        account.status === 'active'
                          ? 'rounded-full bg-green-500/10 px-2 py-0.5 text-[11px] font-medium text-green-700'
                          : account.status === 'suspended'
                            ? 'rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-700'
                            : 'rounded-full bg-orange-500/10 px-2 py-0.5 text-[11px] font-medium text-[#9A3412]'
                      }
                    >
                      {account.status.replaceAll('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-[11px] text-[#8A857C]">
                    {fmt(account.emailVerifiedAt)}
                  </td>
                  <td className="py-3 pr-3 text-[11px] text-[#8A857C]">
                    {fmt(account.ownerVerifiedAt)}
                  </td>
                  <td className="py-3">
                    <form action={setAccountVerification}>
                      <input type="hidden" name="clerkId" value={account.clerkId} />
                      <input
                        type="hidden"
                        name="mode"
                        value={account.ownerVerifiedAt ? 'unverify' : 'verify'}
                      />
                      <button
                        type="submit"
                        className="rounded-full border border-[#141414]/15 bg-white px-3 py-1 text-[11px] font-semibold transition-all hover:border-orange-500/50"
                      >
                        {account.ownerVerifiedAt ? 'Unverify' : 'Verify'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-xs text-[#8A857C]">
                    No accounts yet. Sign-ups appear here after the Clerk webhook is configured.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-6 rounded-[28px] border border-[#141414]/10 bg-white/70 p-6">
        <h2 className="mb-4 text-base font-semibold">Onboarding submissions</h2>
        <div className="space-y-3">
          {submissions.map((submission) => (
            <details
              key={submission.referenceId}
              className="rounded-2xl border border-[#141414]/10 bg-[#F6F5F0]/60 px-4 py-3"
            >
              <summary className="cursor-pointer text-sm">
                <span className="font-mono text-xs">{submission.referenceId}</span>
                <span className="mx-2 text-[#8A857C]">·</span>
                {submission.fullName} ({submission.company})
                <span className="mx-2 text-[#8A857C]">·</span>
                <span className="text-xs text-[#5C5A55]">
                  meeting: {submission.meetingPreference} · {submission.bookingState} ·{' '}
                  {submission.status.replaceAll('_', ' ')}
                </span>
              </summary>
              <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                <div>
                  <dt className="text-[#8A857C]">Email</dt>
                  <dd>{submission.email}</dd>
                </div>
                <div>
                  <dt className="text-[#8A857C]">Submitted</dt>
                  <dd>{submission.createdAt.toISOString()}</dd>
                </div>
                <div>
                  <dt className="text-[#8A857C]">Service</dt>
                  <dd>{submission.service}</dd>
                </div>
                <div>
                  <dt className="text-[#8A857C]">Budget</dt>
                  <dd>{submission.budgetRange}</dd>
                </div>
                <div>
                  <dt className="text-[#8A857C]">Meeting acknowledged</dt>
                  <dd>{submission.meetingAcknowledgedAt ? fmt(submission.meetingAcknowledgedAt) : '—'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[#8A857C]">Message</dt>
                  <dd className="whitespace-pre-wrap leading-relaxed">{submission.message}</dd>
                </div>
              </dl>
            </details>
          ))}
          {submissions.length === 0 && (
            <p className="text-xs text-[#8A857C]">
              No submissions yet. Requests from the “Get Started” form appear here.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6">
        <ul className="space-y-2 text-xs text-[#5C5A55]">
          {auditRows.map((row, index) => (
            <li key={`${row.action}-${index}`} className="flex flex-wrap gap-2">
              <span className="font-mono text-[#141414]">{row.action}</span>
              <span>· {row.actorRole}</span>
              <span>
                · {row.targetType}
                {row.targetId ? ` ${row.targetId}` : ''}
              </span>
              <span className="text-[#8A857C]">· {row.createdAt.toISOString()}</span>
            </li>
          ))}
          {auditRows.length === 0 && <li>No audit events yet.</li>}
        </ul>
        <p className="mt-4 border-t border-[#141414]/10 pt-3 text-[11px] leading-relaxed text-[#8A857C]">
          Access to this route is also protected by Cloudflare Access in production (configured in the
          Cloudflare dashboard), on top of the Clerk owner check enforced here.
        </p>
      </section>
    </main>
  )
}
