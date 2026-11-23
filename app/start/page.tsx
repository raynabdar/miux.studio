import type { Metadata } from 'next'
import Link from 'next/link'
import StartWizard, { type ExistingSubmission } from '@/components/onboarding/start-wizard'
import { getSubmissionByReferenceId } from '@/lib/onboarding/submission'
import { getTurnstileSiteKey } from '@/lib/security/turnstile'
import { getEarlySignUpEnabled } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Start a Project — Miux Studio',
  description:
    'Tell us about your project. A short guided form, then an optional meeting with our team.',
  robots: { index: false, follow: false },
}

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const params = await searchParams
  const referenceId = typeof params.ref === 'string' ? params.ref : undefined
  const earlySignUpEnabled = await getEarlySignUpEnabled()

  let existing: ExistingSubmission | null = null
  if (referenceId) {
    const submission = await getSubmissionByReferenceId(referenceId)
    if (submission) {
      existing = {
        referenceId: submission.referenceId,
        meetingPreference: submission.meetingPreference,
        acknowledged: submission.meetingAcknowledgedAt !== null,
      }
    }
  }

  return (
    <main className="relative min-h-screen w-full bg-[#F6F5F0] text-[#141414]">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-8 sm:px-8">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-[#141414] transition-opacity hover:opacity-70"
          >
            Miux Studio
          </Link>
          <Link
            href="/contact"
            className="text-xs text-[#5C5A55] underline-offset-4 transition-colors hover:text-[#141414] hover:underline"
          >
            Prefer to write us?
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-center py-10">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A857C]">
            Start a project
          </p>
          <h1 className="mb-3 text-3xl leading-tight tracking-tight sm:text-4xl">
            Tell us what you are building.
          </h1>
          <p className="mb-8 max-w-lg text-sm leading-relaxed text-[#5C5A55]">
            Two short steps. You will get a reference ID for your request, and a meeting is
            optional.
          </p>

          <StartWizard
            siteKey={getTurnstileSiteKey()}
            meetingUrl={process.env.MEETING_URL ?? '/meeting'}
            existing={existing}
            earlySignUpEnabled={earlySignUpEnabled}
          />
        </div>
      </div>
    </main>
  )
}
