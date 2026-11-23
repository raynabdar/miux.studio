import { Resend } from 'resend'

// Owner-facing operational alerts. Never called for demo actions.
// Missing configuration degrades to a log line instead of failing the request.
export async function sendOwnerAlert(subject: string, lines: string[]): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL

  if (!apiKey || !to || !from) {
    console.warn('[email] owner alert skipped: Resend env vars are not configured')
    return
  }

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from,
      to,
      subject: `[Miux] ${subject}`,
      text: lines.join('\n'),
    })
  } catch (error) {
    console.error('[email] owner alert failed', (error as Error).message)
  }
}
