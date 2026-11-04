import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/site-shell'

export const metadata: Metadata = {
  title: 'Privacy Policy | MIUX STUDIO',
  description: 'Privacy Policy and data governance standards for MIUX STUDIO clients, visitors, and global partners.',
  alternates: {
    canonical: '/privacy-policy',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />

      <main className="px-5 pb-28 pt-36 sm:pt-44">
        <article className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#707070]">
            Legal &amp; Governance
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-xs text-[#707070]">
            Last updated: November 2026 &bull; &copy; 2016–2026 MIUX STUDIO
          </p>

          <div className="mt-12 space-y-8 text-base leading-relaxed text-[#A3A3A3]">
            <section aria-label="Overview">
              <h2 className="text-xl font-medium tracking-tight text-white">
                1. Overview
              </h2>
              <p className="mt-3">
                At MIUX STUDIO (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), operating via miux.studio, client confidentiality and digital data standards are fundamental to our practice. This policy outlines our collection, processing, and safeguarding protocols when you browse our site, book discovery sessions, or engage our creative and technical teams.
              </p>
            </section>

            <section aria-label="Information We Collect">
              <h2 className="text-xl font-medium tracking-tight text-white">
                2. Information We Collect
              </h2>
              <p className="mt-3">
                We only collect information voluntarily submitted through our enquiry forms, Cal.com scheduling interfaces, and client onboarding workflows:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-[#A3A3A3]">
                <li>Contact information: full name, business email address, phone number, and location.</li>
                <li>Company details: organization name, primary domain, and team size.</li>
                <li>Project scope: creative briefs, timelines, technical requirements, and budget parameters.</li>
              </ul>
              <p className="mt-3">
                We do not sell, license, rent, or trade your personal or business data to external brokers or commercial aggregators under any circumstances.
              </p>
            </section>

            <section aria-label="Purpose of Processing">
              <h2 className="text-xl font-medium tracking-tight text-white">
                3. Purpose of Processing
              </h2>
              <p className="mt-3">
                The information provided is processed strictly to evaluate engagement feasibility, schedule strategy sessions, prepare custom service proposals, execute design sprints and development deliverables, and maintain contractual communications.
              </p>
            </section>

            <section aria-label="Data Protection and Retention">
              <h2 className="text-xl font-medium tracking-tight text-white">
                4. Data Protection &amp; Security
              </h2>
              <p className="mt-3">
                We implement industry-standard encryption in transit (HTTPS / TLS 1.3) and secure cloud-hosted infrastructure for all incoming communications. Sensitive NDA materials and project assets are restricted strictly to team members assigned to your sprint.
              </p>
            </section>

            <section aria-label="Third-Party Integrations">
              <h2 className="text-xl font-medium tracking-tight text-white">
                5. Third-Party Services
              </h2>
              <p className="mt-3">
                We integrate trusted enterprise services to deliver a smooth client experience, including Cal.com for session scheduling and Resend for transactional enquiry delivery. Each partner is vetted for GDPR, SOC-2, and modern privacy compliance.
              </p>
            </section>

            <section aria-label="Your Rights">
              <h2 className="text-xl font-medium tracking-tight text-white">
                6. Your Rights
              </h2>
              <p className="mt-3">
                You have the right to request access to your submitted data, request corrections, or request complete deletion of your records from our systems at any point by contacting our governance team.
              </p>
            </section>

            <section aria-label="Contact Information">
              <h2 className="text-xl font-medium tracking-tight text-white">
                7. Contact
              </h2>
              <p className="mt-3">
                For questions regarding our privacy practices or data rights, contact us at{' '}
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
