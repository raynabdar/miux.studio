import { z } from 'zod'
import { BUDGET_RANGES, PROJECT_TYPES } from '@/lib/schemas'
import { isDisposableEmail } from '@/lib/security/disposable-emails'
import { REFERENCE_ID_PATTERN } from '@/lib/reference-id'

export const emailField = z.preprocess(
  (value) => (typeof value === 'string' ? value.trim().toLowerCase() : value),
  z
    .email('Please enter a valid email address')
    .max(254)
    .refine((value) => !isDisposableEmail(value), {
      message: 'Please use a permanent email address — temporary inboxes are not accepted.',
    })
)

export const startSubmissionSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name').max(120),
  email: emailField,
  company: z.string().trim().min(2, 'Please enter your company or organization').max(160),
  service: z.enum(PROJECT_TYPES),
  budgetRange: z.enum(BUDGET_RANGES),
  message: z
    .string()
    .trim()
    .min(10, 'Please share at least 10 characters about your project')
    .max(5000, 'Please keep your message under 5,000 characters'),
  meetingPreference: z.enum(['yes', 'no'], 'Please choose whether you are open to a meeting'),
  turnstileToken: z.string().min(1, 'Please complete the verification challenge'),
})

export type StartSubmissionInput = z.infer<typeof startSubmissionSchema>

export const acknowledgeMeetingSchema = z.object({
  referenceId: z.string().trim().regex(REFERENCE_ID_PATTERN, 'Invalid reference ID'),
})
