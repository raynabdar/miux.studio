import type { Metadata } from 'next'
import { SITE } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Book a 45-min Call | Miux Studio',
  description:
    'Schedule a 45-minute discovery call with Miux Studio to discuss your brand, web design, or digital product strategy.',
  alternates: {
    canonical: '/meeting',
  },
  openGraph: {
    title: 'Book a 45-min Call | Miux Studio',
    description:
      'Schedule a 45-minute discovery call with Miux Studio to discuss your brand, web design, or digital product strategy.',
    url: `${SITE.url}/meeting`,
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a 45-min Call | Miux Studio',
    description:
      'Schedule a 45-minute discovery call with Miux Studio to discuss your brand, web design, or digital product strategy.',
  },
}

export default function MeetingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
