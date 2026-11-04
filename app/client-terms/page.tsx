import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/site-shell'

export const metadata: Metadata = {
  title: 'Client Terms | MIUX STUDIO',
  description: 'Client engagement standards, sprint governance, payment milestones, and intellectual property transfer for MIUX STUDIO partners.',
  alternates: {
    canonical: '/client-terms',
  },
}

export default function ClientTermsPage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />

      <main className="px-5 pb-28 pt-36 sm:pt-44">
        <article className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#707070]">
            Engagement &amp; Retainers
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
            Client Terms
          </h1>
          <p className="mt-4 text-xs text-[#707070]">
            Last updated: November 2026 &bull; &copy; 2016–2026 MIUX STUDIO
          </p>

          <div className="mt-12 space-y-8 text-base leading-relaxed text-[#A3A3A3]">
            <section aria-label="Engagement Model">
              <h2 className="text-xl font-medium tracking-tight text-white">
                1. Scope of Engagement
              </h2>
              <p className="mt-3">
                All client commissions with MIUX STUDIO operate under dedicated sprint frameworks, project retainers, or tailored master service agreements (MSAs). Each engagement defines specific objectives, design deliverables, technical specifications, and delivery milestones agreed upon before sprint kick-off.
              </p>
            </section>

            <section aria-label="Sprint Velocity & Communication">
              <h2 className="text-xl font-medium tracking-tight text-white">
                2. Sprint Cadence &amp; Velocity
              </h2>
              <p className="mt-3">
                We operate with direct senior-level engineering and design leads. Communications occur via dedicated Slack/Discord shared channels and bi-weekly asynchronous video Loom updates. Clients provide timely feedback within 48 business hours to preserve project velocity.
              </p>
            </section>

            <section aria-label="Milestone Payments">
              <h2 className="text-xl font-medium tracking-tight text-white">
                3. Investment &amp; Payment Milestones
              </h2>
              <p className="mt-3">
                Project retainers are billed on fixed monthly or milestone terms. Standard project engagements require a 50% initial commitment deposit prior to sprint commencement, with remaining balances distributed across agreed delivery milestones. Retainer subscriptions renew on 30-day cycles unless paused or terminated with 14 business days notice.
              </p>
            </section>

            <section aria-label="Intellectual Property Transfer">
              <h2 className="text-xl font-medium tracking-tight text-white">
                4. Intellectual Property &amp; Source Code
              </h2>
              <p className="mt-3">
                Upon complete invoice settlement, 100% full intellectual property, commercial copyright, Figma design files, and production codebases are transferred directly to the client. MIUX STUDIO retains the right to display non-confidential deliverables in our agency showcase and case studies.
              </p>
            </section>

            <section aria-label="Revisions and Change Requests">
              <h2 className="text-xl font-medium tracking-tight text-white">
                5. Iterations &amp; Scope Adjustments
              </h2>
              <p className="mt-3">
                Each sprint phase incorporates structured iterative feedback loops. Any features or expansions outside the agreed Statement of Work (SOW) are seamlessly scoped into subsequent sprints or handled via dedicated hourly extensions.
              </p>
            </section>

            <section aria-label="Confidentiality and NDAs">
              <h2 className="text-xl font-medium tracking-tight text-white">
                6. Mutual Non-Disclosure
              </h2>
              <p className="mt-3">
                We execute mutual NDAs upon request. All proprietary product roadmaps, user metrics, credentials, and internal strategy documents shared with MIUX STUDIO remain strictly confidential.
              </p>
            </section>

            <section aria-label="Questions">
              <h2 className="text-xl font-medium tracking-tight text-white">
                7. Enquiries
              </h2>
              <p className="mt-3">
                For contract amendments or retainer queries, please contact your partner lead or write to{' '}
                <a
                  href="mailto:hello@miux.studio"
                  className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
                >
                  hello@miux.studio
                </a>.
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
