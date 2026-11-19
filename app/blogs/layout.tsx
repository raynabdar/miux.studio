import type { Metadata } from 'next'
import { SITE } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Studio Insights & Journal | Miux Studio',
  description:
    'Perspectives on brand building, design systems, web engineering, UI/UX, and growth from the Miux Studio team.',
  alternates: {
    canonical: '/blogs',
  },
  openGraph: {
    title: 'Studio Insights & Journal | Miux Studio',
    description:
      'Perspectives on brand building, design systems, web engineering, UI/UX, and growth from the Miux Studio team.',
    url: `${SITE.url}/blogs`,
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio Insights & Journal | Miux Studio',
    description:
      'Perspectives on brand building, design systems, web engineering, UI/UX, and growth from the Miux Studio team.',
  },
}

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Miux Studio Insights & Journal',
    url: `${SITE.url}/blogs`,
    description:
      'Perspectives on brand building, design systems, web engineering, UI/UX, and growth from the Miux Studio team.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      {children}
    </>
  )
}
