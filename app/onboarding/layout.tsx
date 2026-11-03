import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Onboarding | Miux Studio',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
