// Server-only Gemini REST client. The key never leaves the server; callers get
// safe, generic errors. Timeouts are enforced with AbortController so a slow
// provider cannot hang a request.

export type AiTurn = { role: 'user' | 'model'; text: string }

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
}

const TIMEOUT_MS = 25_000

export async function askGemini({
  systemInstruction,
  turns,
}: {
  systemInstruction: string
  turns: AiTurn[]
}): Promise<{ ok: true; text: string } | { ok: false; message: string }> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return { ok: false, message: 'The assistant is not configured yet.' }
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: turns.map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] })),
          generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
        }),
        signal: controller.signal,
      }
    )

    if (!response.ok) {
      console.error('[ai] gemini responded', response.status)
      return { ok: false, message: 'The assistant is unavailable right now. Please try again.' }
    }

    const data = (await response.json()) as GeminiResponse
    const text = (data.candidates?.[0]?.content?.parts ?? [])
      .map((part) => part.text ?? '')
      .join('')
      .trim()

    if (!text) {
      return { ok: false, message: 'The assistant could not answer that. Please try again.' }
    }
    return { ok: true, text }
  } catch {
    return { ok: false, message: 'The assistant timed out. Please try again.' }
  } finally {
    clearTimeout(timer)
  }
}
