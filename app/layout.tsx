import { Analytics } from '@vercel/analytics/next'
import BackToTop from '@/components/BackToTop'
import MiniDotFlameCursor from '@/components/MiniDotFlameCursor'
import { NoiseGradientBackground } from 'noise-gradient-bg'
import CmsProvider from '@/components/cms/cms-provider'
import DiscountBanner from '@/components/cms/discount-banner'
import { getPublicContent } from '@/lib/cms/queries'
import type { Metadata, Viewport } from 'next'
import { faqs, SITE, SOCIAL_LINKS } from '@/lib/data'
import './globals.css'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

/* ── Metadata ──────────────────────────────────────────────── */

const SITE_DESCRIPTION =
  'Miux Studio is a design and engineering studio based in Bangladesh, building brand identities and websites for teams across APAC and the UAE.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: 'Next-gen Creative Web Agency',
  description: SITE_DESCRIPTION,
  keywords: [
    'Websites for Brands',
    'Digital Businesses',
    'Custom business website',
    'Web Design Agency',
    'Web Development',
    'UI/UX Design',
    'Startup Websites',
    'Miux Studio',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: 'Miux Studio',
  publisher: 'Miux Studio',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Next-gen Creative Web Agency',
    description: SITE_DESCRIPTION,
    url: SITE.url,
    siteName: SITE.name,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next-gen Creative Web Agency',
    description: SITE_DESCRIPTION,
    creator: '@miuxhq',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F6F5F0',
  userScalable: true,
}

/* ── JSON-LD ───────────────────────────────────────────────── */

function buildJsonLd() {
  const address = {
    '@type': 'PostalAddress',
    addressLocality: SITE.locality,
    addressCountry: SITE.country,
  }

  const contactPoint = SITE.phoneTel
    ? {
        '@type': 'ContactPoint',
        telephone: SITE.phoneTel,
        contactType: 'customer service',
        areaServed: [...SITE.areaServed],
        availableLanguage: ['English'],
      }
    : undefined

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.png`,
    email: SITE.email,
    foundingDate: String(SITE.founded),
    description:
      'Design and engineering studio specialising in brand identity, web design, web development, UI/UX, and advertising campaigns.',
    sameAs: SOCIAL_LINKS.map((link) => link.href),
    address,
    ...(contactPoint ? { contactPoint } : {}),
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
  }

  const professionalService = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    description:
      'Brand design, web design, web development, UI/UX, and advertising campaigns.',
    areaServed: [...SITE.areaServed],
    address,
    ...(SITE.phoneTel ? { telephone: SITE.phoneTel } : {}),
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return { organization, website, professionalService, faqPage }
}

/* ── Root Layout ───────────────────────────────────────────── */

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { organization, website, professionalService, faqPage } = buildJsonLd()
  const content = await getPublicContent()

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
      <body className={`${geistSans.className} font-sans antialiased bg-[#F6F5F0] text-[#141414] selection:bg-[#141414] selection:text-[#F6F5F0]`}>
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalService) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
        />

        <NoiseGradientBackground
          theme="custom"
          primaryColor="rgba(249, 115, 22, 0.24)"
          secondaryColor="rgba(251, 146, 60, 0.16)"
          tertiaryColor="rgba(254, 215, 170, 0.12)"
          noiseOpacity={50}
          microNoiseOpacity={35}
          primaryBlur={40}
          secondaryBlur={32}
          tertiaryBlur={24}
          vignetteIntensity="none"
          className="pointer-events-none z-30 mix-blend-soft-light opacity-65 md:opacity-75 will-change-transform [transform:translate3d(0,0,0)] [backface-visibility:hidden] [contain:strict] [&>div:nth-last-child(-n+2)]:hidden"
        />

        <CmsProvider value={content}>
          {children}
          <DiscountBanner />
        </CmsProvider>
        <BackToTop />
        <MiniDotFlameCursor />

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
