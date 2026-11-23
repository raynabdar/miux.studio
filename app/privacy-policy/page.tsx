import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/site-shell'
import { LEGAL, SITE } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Privacy Policy | Miux Studio',
  description:
    'How Miux Studio collects, uses, and protects the information you submit through enquiry forms and scheduling.',
  alternates: {
    canonical: '/privacy-policy',
  },
}

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-4 text-xs text-[#78756E]">
            Last updated: {LEGAL.lastUpdated} &bull; {LEGAL.entity}, {LEGAL.address}
          </p>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-[#5C5A55]">
            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Overview">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                1. Overview
              </h2>
              <p className="mt-3">
                This policy explains what information {LEGAL.entity} collects through {SITE.url.replace('https://', '')}, why we collect it, and how it is handled. It covers the contact form, the project onboarding form, and the scheduling embed we use for discovery calls.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Information we collect">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                2. Information We Collect
              </h2>
              <p className="mt-3">
                We collect only what you type into our forms. There is no account system and nothing is collected passively beyond the analytics described below.
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-[#5C5A55]">
                <li>
                  <span className="font-medium text-[#141414]">Contact form:</span> your name, email address, company (optional), project type, budget range, and your message.
                </li>
                <li>
                  <span className="font-medium text-[#141414]">Onboarding form:</span> company and contact name, business context, competitors, goals, timeline, services required, budget range, and any optional brand, digital, or automation details you choose to share.
                </li>
                <li>
                  <span className="font-medium text-[#141414]">Scheduling:</span> when you book a call, the name, email, and notes you enter are handled by Cal.com under its own privacy policy.
                </li>
              </ul>
              <p className="mt-3">
                We do not sell, rent, license, or trade your information to data brokers or advertisers.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="How we use information">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                3. How We Use It
              </h2>
              <p className="mt-3">
                Submitted information is used to reply to your enquiry, scope and price a proposal, deliver the engagement, and send transactional messages about it. Form submissions are delivered by email through Resend. We do not run marketing campaigns against this list, and we do not add you to a newsletter without a separate opt-in.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Cookies and analytics">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                4. Cookies &amp; Analytics
              </h2>
              <p className="mt-3">
                The site itself sets no advertising or tracking cookies. Some third-party embeds may set cookies when they load:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-[#5C5A55]">
                <li>
                  <a
                    href="https://vercel.com/docs/analytics/privacy-policy"
                    className="text-[#141414] underline decoration-[#141414]/30 underline-offset-4 hover:decoration-[#141414]"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Vercel Web Analytics
                  </a>{' '}
                  measures aggregate page views and referrers. It is cookieless and does not fingerprint individual visitors.
                </li>
                <li>
                  The scheduling embed on the booking page is provided by Cal.com and may set cookies required for the booking flow.
                </li>
              </ul>
              <p className="mt-3">
                You can block these scripts in your browser or with an extension; the contact form and all page content still work without them.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Security and retention">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                5. Security &amp; Retention
              </h2>
              <p className="mt-3">
                Traffic is served over HTTPS. Enquiry emails are stored in our business inbox and in Resend&apos;s delivery logs. Project materials and NDAs are visible only to the team assigned to your engagement. We keep enquiry records for as long as needed to answer you and maintain a commercial record, and delete them on request.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Your rights">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                6. Your Choices
              </h2>
              <p className="mt-3">
                You can ask us to confirm what we hold about you, correct it, or delete it. Write to the address below and we will respond within a reasonable period. If a request concerns a record held by Cal.com, we will point you to the relevant control in their service.
              </p>
            </section>

            <section className="border-t border-[#141414]/[0.08] pt-10 first:border-t-0 first:pt-0" aria-label="Changes and contact">
              <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                7. Changes &amp; Contact
              </h2>
              <p className="mt-3">
                If this policy changes materially we will update the date at the top of the page. Questions about it, or about the data we hold, go to{' '}
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
