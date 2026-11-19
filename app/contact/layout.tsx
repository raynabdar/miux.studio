import type { Metadata } from 'next'
import { SITE } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Contact | Miux Studio',
  description:
    'Start a conversation with Miux Studio. Brand identity, web design, web development, UI/UX, and campaigns across Asia and the UAE.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact | Miux Studio',
    description:
      'Start a conversation with Miux Studio. Brand identity, web design, web development, UI/UX, and campaigns across Asia and the UAE.',
    url: `${SITE.url}/contact`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Miux Studio',
    description:
      'Start a conversation with Miux Studio. Brand identity, web design, web development, UI/UX, and campaigns across Asia and the UAE.',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Miux Studio',
    url: `${SITE.url}/contact`,
    description:
      'Start a conversation with Miux Studio. We reply within one business day.',
    mainEntity: {
      '@type': 'ProfessionalService',
      name: SITE.name,
      email: SITE.email,
      areaServed: [...SITE.areaServed],
      address: {
        '@type': 'PostalAddress',
        addressLocality: SITE.locality,
        addressCountry: SITE.country,
      },
      ...(SITE.phoneTel ? { telephone: SITE.phoneTel } : {}),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      {children}
    </>
  )
}
