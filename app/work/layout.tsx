import type { Metadata } from 'next'
import { projects, SITE } from '@/lib/data'

const DESCRIPTION =
  'Selected case studies from Miux Studio — brand identities, websites, digital products and campaigns built for teams across APAC and the UAE.'

export const metadata: Metadata = {
  title: 'Work & Case Studies | Miux Studio',
  description: DESCRIPTION,
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    title: 'Work & Case Studies | Miux Studio',
    description: DESCRIPTION,
    url: `${SITE.url}/work`,
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work & Case Studies | Miux Studio',
    description: DESCRIPTION,
  },
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Miux Studio Work & Case Studies',
    url: `${SITE.url}/work`,
    description: DESCRIPTION,
    hasPart: projects.map((project) => ({
      '@type': 'CreativeWork',
      name: project.title,
      url: `${SITE.url}/work/${project.slug}`,
    })),
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
