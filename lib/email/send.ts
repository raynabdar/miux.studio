// Thin Resend wrapper for portal notifications. Silent no-op when unconfigured
// (local development), never throws into request paths.

export async function sendEmail({
  to,
  subject,
  lines,
}: {
  to: string
  subject: string
  lines: string[]
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL
  if (!apiKey || !from) {
    console.warn('[email] Resend is not configured; skipped:', subject)
    return
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], subject, text: lines.join('\n') }),
    })
    if (!response.ok) {
      console.error('[email] send failed', response.status)
    }
  } catch (error) {
    console.error('[email] send error', (error as Error).message)
  }
}
