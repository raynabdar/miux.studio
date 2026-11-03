import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/site-shell'

export const metadata: Metadata = {
  title: 'Privacy Policy | Miux Studio',
  description: 'Privacy Policy and data governance standards for Miux Studio clients and visitors.',
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />

      <main className="px-5 pb-28 pt-36 sm:pt-44">
        <article className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#707070]">
            Legal & Governance
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-xs text-[#707070]">
            Last updated: January 2026
          </p>

          <div className="mt-12 space-y-8 text-base leading-relaxed text-[#A3A3A3]">
            <section aria-label="Introduction">
              <h2 className="text-xl font-medium tracking-tight text-white">
                1. Overview
              </h2>
              <p className="mt-3">
                At Miux Studio (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), domain miux.studio, we hold our client confidentiality and digital data standards to the highest degree. This policy explains how we collect, process, and protect your information when accessing our site or engaging with our creative services across Asia and the UAE.
              </p>
            </section>

            <section aria-label="Information Collection">
              <h2 className="text-xl font-medium tracking-tight text-white">
                2. Information We Collect
              </h2>
              <p className="mt-3">
                We only gather details you directly provide through our contact enquiries or client onboarding workflows: your name, business email, contact number, company name, project parameters, and creative references. We do not sell, rent, or trade your data with external brokers under any circumstances.
              </p>
            </section>

            <section aria-label="Data Usage">
              <h2 className="text-xl font-medium tracking-tight text-white">
                3. Purpose of Processing
              </h2>
              <p className="mt-3">
                Information provided is utilized solely to evaluate project suitability, prepare sprint estimates, execute agreed design and development engagements, and communicate operational milestones.
              </p>
            </section>

            <section aria-label="Security and Retention">
              <h2 className="text-xl font-medium tracking-tight text-white">
                4. Data Protection
              </h2>
              <p className="mt-3">
                We enforce modern encryption and access constraints across our hosting and communication channels. Inactive client submission logs are routinely archived and deleted following engagement completion.
              </p>
            </section>

            <section aria-label="Contact Inquiries">
              <h2 className="text-xl font-medium tracking-tight text-white">
                5. Questions & Requests
              </h2>
              <p className="mt-3">
                For questions regarding your data or to request record removal, contact our data administrator directly at{' '}
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
