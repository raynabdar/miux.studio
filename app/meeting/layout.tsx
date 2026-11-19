import type { Metadata } from 'next'

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
    url: 'https://miux.studio/meeting',
    siteName: 'Miux Studio',
    images: [
      {
        url: 'https://miux.studio/logo.png',
        width: 800,
        height: 800,
        alt: 'Book a call with Miux Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a 45-min Call | Miux Studio',
    description:
      'Schedule a 45-minute discovery call with Miux Studio to discuss your brand, web design, or digital product strategy.',
    images: ['https://miux.studio/logo.png'],
  },
}

export default function MeetingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
