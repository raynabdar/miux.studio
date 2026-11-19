import type { Metadata } from 'next'

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
    url: 'https://miux.studio/blogs',
    siteName: 'Miux Studio',
    images: [
      {
        url: 'https://miux.studio/logo.png',
        width: 800,
        height: 800,
        alt: 'Miux Studio Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio Insights & Journal | Miux Studio',
    description:
      'Perspectives on brand building, design systems, web engineering, UI/UX, and growth from the Miux Studio team.',
    images: ['https://miux.studio/logo.png'],
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
    url: 'https://miux.studio/blogs',
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
