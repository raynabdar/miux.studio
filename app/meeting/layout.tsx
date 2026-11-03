import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a 45-min Call | Miux Studio',
  description:
    'Select a date and time for your strategy call with Miux Studio, or contact directly via WhatsApp or Telegram.',
}

export default function MeetingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
