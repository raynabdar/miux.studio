import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects & Work Portfolio | Miux Studio',
  description:
    'Explore featured brand identity, web design, UI/UX, and web development case studies by Miux Studio across Asia and the UAE.',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Projects & Work Portfolio | Miux Studio',
    description:
      'Explore featured brand identity, web design, UI/UX, and web development case studies by Miux Studio across Asia and the UAE.',
    url: 'https://miux.studio/projects',
    siteName: 'Miux Studio',
    images: [
      {
        url: 'https://miux.studio/logo.png',
        width: 800,
        height: 800,
        alt: 'Miux Studio Projects',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects & Work Portfolio | Miux Studio',
    description:
      'Explore featured brand identity, web design, UI/UX, and web development case studies by Miux Studio across Asia and the UAE.',
    images: ['https://miux.studio/logo.png'],
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Miux Studio Projects & Case Studies',
    url: 'https://miux.studio/projects',
    description:
      'Featured brand identity, web design, UI/UX, and web development case studies by Miux Studio.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      {children}
    </>
  )
}
