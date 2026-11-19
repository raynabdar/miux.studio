import { z } from 'zod'

export const PROJECT_TYPES = [
  'Brand Design and Identity',
  'Web Design',
  'Web Development',
  'UI/UX Design',
  'Ads and Campaigns',
  'AI Automation & Systems',
  'Other',
] as const

export const BUDGET_RANGES = [
  'Under $5,000',
  '$5,000 – $10,000',
  '$10,000 – $25,000',
  '$25,000 – $50,000',
  '$50,000+',
] as const

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(100),
  email: z.string().trim().email('Please enter a valid email address').max(254),
  company: z.string().trim().max(120).optional(),
  projectType: z.enum(PROJECT_TYPES),
  budget: z
    .string()
    .trim()
    .min(1, 'Please select a budget range')
    .refine(
      (value) => (BUDGET_RANGES as readonly string[]).includes(value),
      'Please choose a valid budget range'
    ),
  message: z
    .string()
    .trim()
    .min(10, 'Please share at least 10 characters about your project')
    .max(5000, 'Please keep your message under 5,000 characters'),
  website: z.string().max(200).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>

const shortAnswer = (message: string) => z.string().trim().min(1, message).max(500)
const longAnswer = (message: string) => z.string().trim().min(1, message).max(3000)
const optionalAnswer = z.string().trim().max(1000).optional()

export const onboardingSchema = z.object({
  q1: shortAnswer('Please provide company name and contact person.'),
  q2: longAnswer('Please describe your business and customers.'),
  q3: longAnswer('Please list your main competitors.'),
  q4: longAnswer('Please share what you want to achieve in the next 6 to 12 months.'),
  q5: shortAnswer('Please provide your deadline or launch date.'),

  services: z
    .array(z.string().trim().max(80))
    .min(1, 'Please select at least one service.')
    .max(20),

  q6: shortAnswer('Please provide your budget range.'),
  q7: shortAnswer('Please provide your ideal timeline.'),

  q8: optionalAnswer,
  q9: optionalAnswer,
  q10: optionalAnswer,
  q11: optionalAnswer,
  q12: optionalAnswer,
  q13: optionalAnswer,
  q14: optionalAnswer,
  q15: optionalAnswer,
  q16: optionalAnswer,
  q17: optionalAnswer,

  q18: longAnswer('Please let us know if there is anything else.'),
  q19: shortAnswer('Please indicate if you prefer a call or a written proposal next.'),

  website: z.string().max(200).optional(),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>

export const teardownSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100),
  email: z.string().trim().email('Please enter a valid email address').max(254),
  website: z
    .string()
    .trim()
    .min(4, 'Please enter your website address')
    .max(300)
    .refine((value) => /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(value), {
      message: 'Please enter a valid website address',
    }),
  notes: z.string().trim().max(1000).optional(),
  company: z.string().max(200).optional(),
})

export type TeardownInput = z.infer<typeof teardownSchema>
