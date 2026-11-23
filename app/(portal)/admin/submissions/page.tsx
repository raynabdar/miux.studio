import type { Metadata } from 'next'
import Link from 'next/link'
import { requireFounder } from '@/lib/auth/session'
import { listSubmissions } from '@/lib/admin/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sign-up submissions — Miux Studio Admin',
  robots: { index: false, follow: false },
}

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default async function AdminSubmissionsPage() {
  await requireFounder()
  const submissions = await listSubmissions()

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <nav className="mb-6 text-xs text-[#8A857C]">
        <Link href="/admin" className="hover:text-orange-700">
          Admin
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#5C5A55]">Submissions</span>
      </nav>
      <h1 className="mb-6 text-2xl tracking-tight sm:text-3xl">Sign-up submissions</h1>

      {submissions.length === 0 ? (
        <p className="text-sm text-[#8A857C]">No submissions yet.</p>
      ) : (
        <ul className="space-y-3">
          {submissions.map((submission) => (
            <li key={submission.id} className="rounded-[24px] border border-[#141414]/10 bg-white/70 p-5 backdrop-blur-xl">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {submission.fullName} · {submission.company}
                  </p>
                  <p className="text-xs text-[#8A857C]">
                    {submission.email} · {dateFmt.format(submission.createdAt)}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-[#8A857C]">{submission.referenceId}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.08em]">
                  <span className="rounded-full bg-[#F6F5F0] px-2.5 py-1 text-[#5C5A55]">{submission.status}</span>
                  <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">
                    meeting: {submission.meetingPreference}
                  </span>
                  <span className="rounded-full bg-[#F6F5F0] px-2.5 py-1 text-[#5C5A55]">
                    booking: {submission.bookingState}
                  </span>
                </div>
              </div>
              <dl className="mt-3 grid gap-2 text-sm text-[#5C5A55] sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-[#8A857C]">Service</dt>
                  <dd>{submission.service}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-[#8A857C]">Budget</dt>
                  <dd>{submission.budgetRange}</dd>
                </div>
              </dl>
              <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-[#F6F5F0] px-4 py-3 text-sm text-[#3D3226]">
                {submission.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
