'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { enforceLimit } from '@/lib/ratelimit'
import {
  isTurnstileSecretConfigured,
  verifyTurnstile,
  type TurnstileAction,
} from '@/lib/security/turnstile'
import {
  clearSignInFailures,
  isSignInLocked,
  recordSignInFailure,
} from '@/lib/security/lockout'
import { sendOwnerAlert } from '@/lib/email/notify-owner'
import { emailField } from '@/lib/validation/onboarding'

async function requestIp() {
  const headerStore = await headers()
  return (
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerStore.get('x-real-ip') ||
    'unknown'
  )
}

const emailInput = z.object({ email: emailField })

export async function verifyAuthChallenge(
  token: string,
  expectedAction?: TurnstileAction
): Promise<boolean> {
  if (!isTurnstileSecretConfigured()) return process.env.NODE_ENV !== 'production'
  return verifyTurnstile(token, { remoteIp: await requestIp(), expectedAction })
}

export type PreSignInResult =
  | { ok: true }
  | { ok: false; message: string; retryAfterSeconds?: number }

export async function preSignInCheck(input: unknown): Promise<PreSignInResult> {
  const parsed = emailInput.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: 'Please enter a valid email address.' }
  }
  const ip = await requestIp()
  const limit = await enforceLimit('sign-in', `${ip}:${parsed.data.email}`)
  if (!limit.ok) {
    return {
      ok: false,
      message: 'Too many sign-in attempts. Please try again shortly.',
      retryAfterSeconds: limit.retryAfterSeconds,
    }
  }
  if (await isSignInLocked(parsed.data.email)) {
    return {
      ok: false,
      message:
        'This account is temporarily locked after repeated failed sign-ins. Our team has been notified and will reach out.',
    }
  }
  return { ok: true }
}

export async function noteSignInFailure(input: unknown): Promise<{ locked: boolean }> {
  const parsed = emailInput.safeParse(input)
  if (!parsed.success) return { locked: false }
  const { locked } = await recordSignInFailure(parsed.data.email)
  if (locked) {
    await sendOwnerAlert('Sign-in temporarily locked', [
      `Email: ${parsed.data.email}`,
      'Five or more failed sign-in attempts in 15 minutes. The account is temporarily locked.',
      `IP: ${await requestIp()}`,
    ])
  }
  return { locked }
}

export async function noteSignInSuccess(input: unknown): Promise<{ ok: true }> {
  const parsed = emailInput.safeParse(input)
  if (parsed.success) await clearSignInFailures(parsed.data.email)
  return { ok: true }
}

export async function checkSignUpEmail(input: unknown): Promise<{ ok: boolean; message?: string }> {
  const parsed = emailInput.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? 'Please enter a valid email address.',
    }
  }
  const limit = await enforceLimit('sign-up', `${await requestIp()}:${parsed.data.email}`)
  if (!limit.ok) {
    return { ok: false, message: 'Too many sign-up attempts. Please try again later.' }
  }
  return { ok: true }
}

export async function checkPasswordResetLimit(
  input: unknown
): Promise<{ ok: boolean; message?: string }> {
  const parsed = emailInput.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: 'Please enter a valid email address.' }
  }
  const limit = await enforceLimit('password-reset', `${await requestIp()}:${parsed.data.email}`)
  if (!limit.ok) {
    return { ok: false, message: 'Too many reset requests. Please try again later.' }
  }
  return { ok: true }
}
