import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/site-shell'

export const metadata: Metadata = {
  title: 'Terms of Service | MIUX STUDIO',
  description: 'Terms of Service governing the use of MIUX STUDIO websites and design services.',
  alternates: {
    canonical: '/terms',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />

      <main className="px-5 pb-28 pt-36 sm:pt-44">
        <article className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#707070]">
            Legal & Governance
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-xs text-[#707070]">
            Last updated: November 2026 &bull; &copy; 2016–2026 MIUX STUDIO
          </p>

          <div className="mt-12 space-y-8 text-base leading-relaxed text-[#A3A3A3]">
            <section aria-label="Acceptance of terms">
              <h2 className="text-xl font-medium tracking-tight text-white">
                1. Acceptance of Terms
              </h2>
              <p className="mt-3">
                By accessing miux.studio or commissioning creative work with Miux Studio, you agree to comply with and be bound by these Terms of Service. If you disagree with any portion of these provisions, you should refrain from utilizing our services.
              </p>
            </section>

            <section aria-label="Scope of services">
              <h2 className="text-xl font-medium tracking-tight text-white">
                2. Scope of Services
              </h2>
              <p className="mt-3">
                Miux Studio provides professional design and engineering services across brand design and identity, web design, web development, UI/UX design, and ads and marketing campaigns. Specific scope, milestones, and deliverables are governed by customized engagement agreements signed prior to project kick-off.
              </p>
            </section>

            <section aria-label="Intellectual property">
              <h2 className="text-xl font-medium tracking-tight text-white">
                3. Intellectual Property Rights
              </h2>
              <p className="mt-3">
                Upon final settlement of all agreed engagement invoices, full intellectual property and commercial copyright of bespoke deliverables are transferred to the client. Miux Studio retains the perpetual, non-exclusive right to showcase completed works within our portfolio and promotional materials.
              </p>
            </section>

            <section aria-label="Warranties and limitations">
              <h2 className="text-xl font-medium tracking-tight text-white">
                4. Warranties & Limitation of Liability
              </h2>
              <p className="mt-3">
                Our creative solutions and codebase are engineered following high industry standards. Miux Studio shall not be liable for indirect, incidental, or consequential damages resulting from third-party hosting outages, domain registrar disruptions, or external platform API deprecations.
              </p>
            </section>

            <section aria-label="Governing law">
              <h2 className="text-xl font-medium tracking-tight text-white">
                5. Contact & Inquiries
              </h2>
              <p className="mt-3">
                For commercial inquiries or legal notices, contact us at{' '}
                <a
                  href="mailto:hello@miux.studio"
                  className="text-white underline underline-offset-4 hover:text-[#A3A3A3]"
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
