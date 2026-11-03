import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { faqs } from '@/lib/data'
import './globals.css'

const geistSans = localFont({
  src: './fonts/geist-sans.woff2',
  variable: '--font-geist-sans',
  display: 'swap',
})

/* ── Metadata ──────────────────────────────────────────────── */

export const metadata: Metadata = {
  metadataBase: new URL('https://miux.studio'),
  title: 'Miux Studio — Websites for Brands & Digital Businesses',
  description:
    'Get a website or custom business website that fulfills your goals & drives sales. 48+ startups & founders choose miux.studio. Book a 45-min call.',
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
  authors: [{ name: 'Miux Studio', url: 'https://miux.studio' }],
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
    title: 'Miux Studio — Websites for Brands & Digital Businesses',
    description:
      'Get a website or custom business website that fulfills your goals & drives sales. 48+ startups & founders choose miux.studio.',
    url: 'https://miux.studio',
    siteName: 'Miux Studio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miux Studio — Websites for Brands & Digital Businesses',
    description:
      'Get a website or custom business website that fulfills your goals & drives sales. 48+ startups & founders choose miux.studio.',
    creator: '@miuxstudio',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#141414',
  userScalable: true,
}

/* ── JSON-LD ───────────────────────────────────────────────── */

function buildJsonLd() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Miux Studio',
    url: 'https://miux.studio',
    logo: 'https://miux.studio/icon.svg',
    description:
      'Creative agency specialising in brand identity, web design, web development, UI/UX, and advertising campaigns.',
    sameAs: ['https://facebook.com/Miuxstudio'],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Miux Studio',
    url: 'https://miux.studio',
  }

  const professionalService = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Miux Studio',
    url: 'https://miux.studio',
    description:
      'Brand design, web design, web development, UI/UX, and advertising campaigns.',
    areaServed: ['Asia', 'United Arab Emirates'],
    priceRange: '$$$$',
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { organization, website, professionalService, faqPage } = buildJsonLd()

  return (
    <html lang="en" className={geistSans.variable}>
      <body className={`${geistSans.className} font-sans antialiased bg-[#141414] text-white selection:bg-white selection:text-black`}>
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

        {children}

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
