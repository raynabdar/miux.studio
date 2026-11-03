import type { Metadata } from 'next'

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
    url: 'https://miux.studio/contact',
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
    url: 'https://miux.studio/contact',
    description:
      'Start a conversation with Miux Studio. We reply within one business day.',
    mainEntity: {
      '@type': 'ProfessionalService',
      name: 'Miux Studio',
      email: 'hello@miux.studio',
      areaServed: ['Asia', 'United Arab Emirates'],
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
