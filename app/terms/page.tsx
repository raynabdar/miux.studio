import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/site-shell'
import { LEGAL, SITE } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Terms of Service | Miux Studio',
  description: 'Terms of Service governing the use of the Miux Studio website and design services.',
  alternates: {
    canonical: '/terms',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#141414]">
      <Navbar />

      <main className="relative px-5 pb-28 pt-36 sm:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[540px] overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.1)_0%,rgba(234,88,12,0.03)_45%,transparent_70%)] blur-[100px]" />
        </div>
        <article className="relative mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#78756E]">
            Legal &amp; Governance
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#141414] sm:text-6xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-xs text-[#78756E]">
            Last updated: {LEGAL.lastUpdated} &bull; {LEGAL.entity}, {LEGAL.address}
          </p>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-[#5C5A55]">
            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Acceptance of terms">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                1. Acceptance of Terms
              </h2>
              <p className="mt-3">
                By accessing {SITE.url.replace('https://', '')} or commissioning work from {LEGAL.entity}, you agree to these Terms of Service. If you do not agree with any part of them, please do not use the site or our services.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Scope of services">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                2. Scope of Services
              </h2>
              <p className="mt-3">
                Miux Studio provides professional design and engineering services across brand design and identity, web design, web development, UI/UX design, and ads and marketing campaigns. Specific scope, milestones, and deliverables are governed by customized engagement agreements signed prior to project kick-off.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Intellectual property">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                3. Intellectual Property Rights
              </h2>
              <p className="mt-3">
                Upon settlement of all agreed invoices, ownership of the bespoke deliverables produced for your engagement transfers to you. {LEGAL.entity} retains a non-exclusive right to showcase non-confidential deliverables in its portfolio and case studies.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Warranties and limitations">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                4. Warranties & Limitation of Liability
              </h2>
              <p className="mt-3">
                Work is produced to professional industry standards. To the maximum extent permitted by law, {LEGAL.entity} is not liable for indirect, incidental, or consequential loss, including losses arising from third-party hosting outages, domain registrar disruptions, or changes to external platform APIs.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Governing law">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                5. Governing Law
              </h2>
              <p className="mt-3">
                These terms are governed by {LEGAL.governingLaw}. Any dispute arising from them is subject to the exclusive jurisdiction of the courts of Bangladesh.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Contact and legal notices">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                6. Contact &amp; Legal Notices
              </h2>
              <p className="mt-3">
                {LEGAL.entity}, {LEGAL.address}. For commercial inquiries or legal notices, write to{' '}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-[#141414] underline underline-offset-4 hover:text-[#5C5A55]"
                >
                  {SITE.email}
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
