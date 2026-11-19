import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/site-shell'
import { LEGAL, SITE } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Client Terms | Miux Studio',
  description:
    'Client engagement standards, sprint governance, payment milestones, and intellectual property transfer for Miux Studio partners.',
  alternates: {
    canonical: '/client-terms',
  },
}

export default function ClientTermsPage() {
  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#141414]">
      <Navbar />

      <main className="relative px-5 pb-28 pt-36 sm:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[540px] overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.1)_0%,rgba(234,88,12,0.03)_45%,transparent_70%)] blur-[100px]" />
        </div>
        <article className="relative mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#78756E]">
            Engagement &amp; Retainers
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#141414] sm:text-6xl">
            Client Terms
          </h1>
          <p className="mt-4 text-xs text-[#78756E]">
            Last updated: {LEGAL.lastUpdated} &bull; {LEGAL.entity}, {LEGAL.address}
          </p>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-[#5C5A55]">
            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Scope of engagement">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                1. Scope of Engagement
              </h2>
              <p className="mt-3">
                Every commission runs under a dedicated sprint framework, a monthly retainer, or a tailored master service agreement. Each engagement defines its objectives, deliverables, technical specifications, and delivery milestones in writing before kick-off. Nothing outside the signed scope is billed without your written approval.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Sprint cadence and communication">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                2. Sprint Cadence &amp; Communication
              </h2>
              <p className="mt-3">
                You work directly with senior design and engineering leads, not an account layer. Day-to-day communication happens in a shared channel, with a short written progress update at the end of each week. We ask for feedback within two business days so the sprint can keep its velocity; anything that arrives later moves to the next cycle rather than compressing the current one.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Investment and payment milestones">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                3. Investment &amp; Payment Milestones
              </h2>
              <p className="mt-3">
                One-off projects are quoted at a fixed price and invoiced against delivery milestones, with a deposit before the sprint starts and the balance split across the remaining milestones. Monthly retainers are billed at a fixed rate on the same date each month — there is no hourly billing and no surprise invoices for work inside the agreed scope.
              </p>
              <p className="mt-3">
                Either side can pause or cancel a retainer at the end of any billing cycle. Work already delivered or in progress for the current cycle is invoiced normally, and any unused portion of a prepaid annual term is handled under the terms of that agreement.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Intellectual property and source code">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                4. Intellectual Property &amp; Source Code
              </h2>
              <p className="mt-3">
                When the final invoice on an engagement is settled, ownership of the work produced for it — design files, source code, and documentation — transfers to you. {LEGAL.entity} keeps a non-exclusive right to show non-confidential deliverables in its portfolio and case studies, and will always ask before publishing anything that touches your product or data.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Revisions and change requests">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                5. Revisions &amp; Scope Changes
              </h2>
              <p className="mt-3">
                Each sprint phase includes a defined number of revision rounds. Clear creative direction upfront keeps those rounds focused, and we flag a design direction early if we think it will need more. Work that falls outside the agreed scope — new features, extra pages, additional markets — is quoted as a follow-on phase or a new statement of work before it starts.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Confidentiality and NDAs">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                6. Mutual Non-Disclosure
              </h2>
              <p className="mt-3">
                We sign mutual NDAs on request. Product roadmaps, user metrics, credentials, and internal strategy documents shared with us stay confidential: they are visible only to the team assigned to your engagement and are deleted or returned at your request when the engagement ends.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Questions">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                7. Enquiries
              </h2>
              <p className="mt-3">
                For contract amendments or retainer queries, contact your engagement lead or write to{' '}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-[#141414] underline decoration-[#141414]/30 underline-offset-4 hover:decoration-[#141414]"
                >
                  {SITE.email}
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
