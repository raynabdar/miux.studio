'use client'

import { useState } from 'react'
import { Check, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Navbar, Footer } from '@/components/site-shell'
import { MagneticButton } from '@/components/magnetic-button'

const SERVICES_OPTIONS = [
  'Rebranding',
  'New brand design',
  'Brand refresh',
  'Product design',
  'Social media marketing',
  'Social media ads',
  'Web design',
  'UI/UX design',
  'Web development',
  'AI automation and integration',
  'Other',
] as const

type FormState = {
  q1: string
  q2: string
  q3: string
  q4: string
  q5: string
  services: string[]
  q6: string
  q7: string
  q8: string
  q9: string
  q10: string
  q11: string
  q12: string
  q13: string
  q14: string
  q15: string
  q16: string
  q17: string
  q18: string
  q19: string
}

const initialFormState: FormState = {
  q1: '',
  q2: '',
  q3: '',
  q4: '',
  q5: '',
  services: [],
  q6: '',
  q7: '',
  q8: '',
  q9: '',
  q10: '',
  q11: '',
  q12: '',
  q13: '',
  q14: '',
  q15: '',
  q16: '',
  q17: '',
  q18: '',
  q19: '',
}

export default function OnboardingPage() {
  const [formData, setFormData] = useState<FormState>(initialFormState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const toggleService = (service: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(service)
      const updated = exists
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service]
      return { ...prev, services: updated }
    })
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {}

    if (!formData.q1.trim()) newErrors.q1 = 'This field is required.'
    if (!formData.q2.trim()) newErrors.q2 = 'This field is required.'
    if (!formData.q3.trim()) newErrors.q3 = 'This field is required.'
    if (!formData.q4.trim()) newErrors.q4 = 'This field is required.'
    if (!formData.q5.trim()) newErrors.q5 = 'This field is required.'
    if (formData.services.length === 0) newErrors.services = 'Please select at least one service.'
    if (!formData.q6.trim()) newErrors.q6 = 'This field is required.'
    if (!formData.q7.trim()) newErrors.q7 = 'This field is required.'
    if (!formData.q18.trim()) newErrors.q18 = 'This field is required.'
    if (!formData.q19.trim()) newErrors.q19 = 'This field is required.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    const honeypot = String(new FormData(e.currentTarget as HTMLFormElement).get('website') ?? '')

    if (!validate()) {
      window.scrollTo({ top: 200, behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, website: honeypot }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setServerError(data.error || 'Failed to submit onboarding form. Please try again.')
        return
      }

      setSubmitSuccess(true)
      window.scrollTo({ top: 100, behavior: 'smooth' })
    } catch {
      setServerError('A network error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-[#141414]/[0.12] bg-white/85 px-4 py-3 text-sm text-[#141414] placeholder-[#78756E] focus:border-[#141414] focus:bg-white focus:outline-none transition-colors'

  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#141414]">
      <Navbar />

      <main className="relative pt-32 sm:pt-40 pb-28 px-5 overflow-hidden">
        {/* Subtle Ambient Lighting */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[750px] h-[350px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.1)_0%,transparent_70%)] blur-[90px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl">
          {submitSuccess ? (
            <div className="rounded-2xl border border-[#141414]/[0.10] bg-white/85 p-8 sm:p-12 text-center shadow-sm backdrop-blur-md">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
                <CheckCircle2 className="size-8" />
              </div>
              <h1 className="mt-6 text-2xl sm:text-3xl font-semibold tracking-tight text-[#141414]">
                Thank You
              </h1>
              <p className="mt-3 text-sm text-[#5C5A55] max-w-md mx-auto">
                Your onboarding answers have been submitted. Our team will review your project details and follow up promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-12">
              <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
                <label htmlFor="website">Leave this field empty</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-orange-600">
                  Project intake
                </p>
                <h1 className="text-3xl font-semibold tracking-[-0.05em] text-[#141414] sm:text-4xl md:text-5xl">
                  Onboarding questions
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-[#5C5A55] sm:text-base">
                  A few structured questions so we can scope your project accurately before the
                  first call. It takes about ten minutes.
                </p>
              </div>

              {serverError && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-50 p-4 text-sm text-red-700"
                >
                  <AlertCircle className="size-5 shrink-0 text-red-600" />
                  <p>{serverError}</p>
                </div>
              )}

              {/* 1 to 5 */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="q1" className="block text-sm font-medium text-[#141414] mb-2">
                    1. Company name and contact person? <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="q1"
                    type="text"
                    value={formData.q1}
                    onChange={(e) => handleInputChange('q1', e.target.value)}
                    className={inputClass}
                  />
                  {errors.q1 && <p className="mt-1.5 text-xs text-red-600">{errors.q1}</p>}
                </div>

                <div>
                  <label htmlFor="q2" className="block text-sm font-medium text-[#141414] mb-2">
                    2. What does your business do, and who are your customers? <span className="text-orange-600">*</span>
                  </label>
                  <textarea
                    id="q2"
                    rows={3}
                    value={formData.q2}
                    onChange={(e) => handleInputChange('q2', e.target.value)}
                    className={inputClass}
                  />
                  {errors.q2 && <p className="mt-1.5 text-xs text-red-600">{errors.q2}</p>}
                </div>

                <div>
                  <label htmlFor="q3" className="block text-sm font-medium text-[#141414] mb-2">
                    3. Who are your main competitors? <span className="text-orange-600">*</span>
                  </label>
                  <textarea
                    id="q3"
                    rows={2}
                    value={formData.q3}
                    onChange={(e) => handleInputChange('q3', e.target.value)}
                    className={inputClass}
                  />
                  {errors.q3 && <p className="mt-1.5 text-xs text-red-600">{errors.q3}</p>}
                </div>

                <div>
                  <label htmlFor="q4" className="block text-sm font-medium text-[#141414] mb-2">
                    4. What do you want to achieve in the next 6 to 12 months? <span className="text-orange-600">*</span>
                  </label>
                  <textarea
                    id="q4"
                    rows={3}
                    value={formData.q4}
                    onChange={(e) => handleInputChange('q4', e.target.value)}
                    className={inputClass}
                  />
                  {errors.q4 && <p className="mt-1.5 text-xs text-red-600">{errors.q4}</p>}
                </div>

                <div>
                  <label htmlFor="q5" className="block text-sm font-medium text-[#141414] mb-2">
                    5. Is there a deadline or launch date? <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="q5"
                    type="text"
                    value={formData.q5}
                    onChange={(e) => handleInputChange('q5', e.target.value)}
                    className={inputClass}
                  />
                  {errors.q5 && <p className="mt-1.5 text-xs text-red-600">{errors.q5}</p>}
                </div>
              </div>

              {/* SERVICES NEEDED */}
              <div className="pt-4 border-t border-[#141414]/[0.08]">
                <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[#141414] mb-4 uppercase">
                  SERVICES NEEDED (select all that apply) <span className="text-orange-600">*</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SERVICES_OPTIONS.map((service) => {
                    const isSelected = formData.services.includes(service)
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        className={`flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition-all ${
                          isSelected
                            ? 'border-[#141414] bg-[#141414]/[0.06] text-[#141414] font-medium shadow-sm'
                            : 'border-[#141414]/[0.12] bg-white/80 text-[#5C5A55] hover:border-[#141414]/30 hover:text-[#141414]'
                        }`}
                      >
                        <div
                          className={`flex size-5 shrink-0 items-center justify-center rounded border transition-colors ${
                            isSelected
                              ? 'border-[#141414] bg-[#141414] text-[#F6F5F0]'
                              : 'border-[#141414]/25 bg-transparent'
                          }`}
                        >
                          {isSelected && <Check className="size-3.5 stroke-[2.5]" />}
                        </div>
                        <span>{service}</span>
                      </button>
                    )
                  })}
                </div>
                {errors.services && (
                  <p className="mt-2 text-xs text-red-600">{errors.services}</p>
                )}
              </div>

              {/* 6 to 7 */}
              <div className="space-y-6 pt-4 border-t border-[#141414]/[0.08]">
                <div>
                  <label htmlFor="q6" className="block text-sm font-medium text-[#141414] mb-2">
                    6. What is your budget range? <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="q6"
                    type="text"
                    value={formData.q6}
                    onChange={(e) => handleInputChange('q6', e.target.value)}
                    className={inputClass}
                  />
                  {errors.q6 && <p className="mt-1.5 text-xs text-red-600">{errors.q6}</p>}
                </div>

                <div>
                  <label htmlFor="q7" className="block text-sm font-medium text-[#141414] mb-2">
                    7. What is your ideal timeline? <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="q7"
                    type="text"
                    value={formData.q7}
                    onChange={(e) => handleInputChange('q7', e.target.value)}
                    className={inputClass}
                  />
                  {errors.q7 && <p className="mt-1.5 text-xs text-red-600">{errors.q7}</p>}
                </div>
              </div>

              {/* BRAND (if you have one) */}
              <div className="space-y-6 pt-4 border-t border-[#141414]/[0.08]">
                <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[#141414] uppercase">
                  BRAND (if you have one)
                </h2>

                <div>
                  <label htmlFor="q8" className="block text-sm font-medium text-[#141414] mb-2">
                    8. Do you have a logo, colors, or fonts already?
                  </label>
                  <input
                    id="q8"
                    type="text"
                    value={formData.q8}
                    onChange={(e) => handleInputChange('q8', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="q9" className="block text-sm font-medium text-[#141414] mb-2">
                    9. What do you like or dislike about your current brand?
                  </label>
                  <textarea
                    id="q9"
                    rows={2}
                    value={formData.q9}
                    onChange={(e) => handleInputChange('q9', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="q10" className="block text-sm font-medium text-[#141414] mb-2">
                    10. Which brands do you admire, inside or outside your industry?
                  </label>
                  <input
                    id="q10"
                    type="text"
                    value={formData.q10}
                    onChange={(e) => handleInputChange('q10', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="q11" className="block text-sm font-medium text-[#141414] mb-2">
                    11. Pick 3 words that describe how your brand should feel.
                  </label>
                  <input
                    id="q11"
                    type="text"
                    value={formData.q11}
                    onChange={(e) => handleInputChange('q11', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="q12" className="block text-sm font-medium text-[#141414] mb-2">
                    12. Do you have any must-keep elements?
                  </label>
                  <input
                    id="q12"
                    type="text"
                    value={formData.q12}
                    onChange={(e) => handleInputChange('q12', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* DIGITAL AND SOCIAL (if relevant) */}
              <div className="space-y-6 pt-4 border-t border-[#141414]/[0.08]">
                <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[#141414] uppercase">
                  DIGITAL AND SOCIAL (if relevant)
                </h2>

                <div>
                  <label htmlFor="q13" className="block text-sm font-medium text-[#141414] mb-2">
                    13. Do you have a website or app? Share the link.
                  </label>
                  <input
                    id="q13"
                    type="text"
                    value={formData.q13}
                    onChange={(e) => handleInputChange('q13', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="q14" className="block text-sm font-medium text-[#141414] mb-2">
                    14. Which social platforms do you use or want to use?
                  </label>
                  <input
                    id="q14"
                    type="text"
                    value={formData.q14}
                    onChange={(e) => handleInputChange('q14', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="q15" className="block text-sm font-medium text-[#141414] mb-2">
                    15. Do you run ads now? If yes, what is your monthly budget?
                  </label>
                  <input
                    id="q15"
                    type="text"
                    value={formData.q15}
                    onChange={(e) => handleInputChange('q15', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* AI AUTOMATION (if relevant) */}
              <div className="space-y-6 pt-4 border-t border-[#141414]/[0.08]">
                <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[#141414] uppercase">
                  AI AUTOMATION (if relevant)
                </h2>

                <div>
                  <label htmlFor="q16" className="block text-sm font-medium text-[#141414] mb-2">
                    16. Which tasks take up the most time?
                  </label>
                  <textarea
                    id="q16"
                    rows={2}
                    value={formData.q16}
                    onChange={(e) => handleInputChange('q16', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="q17" className="block text-sm font-medium text-[#141414] mb-2">
                    17. Which tools do you use today?
                  </label>
                  <input
                    id="q17"
                    type="text"
                    value={formData.q17}
                    onChange={(e) => handleInputChange('q17', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* 18 to 19 */}
              <div className="space-y-6 pt-4 border-t border-[#141414]/[0.08]">
                <div>
                  <label htmlFor="q18" className="block text-sm font-medium text-[#141414] mb-2">
                    18. Anything else we should know? <span className="text-orange-600">*</span>
                  </label>
                  <textarea
                    id="q18"
                    rows={3}
                    value={formData.q18}
                    onChange={(e) => handleInputChange('q18', e.target.value)}
                    className={inputClass}
                  />
                  {errors.q18 && <p className="mt-1.5 text-xs text-red-600">{errors.q18}</p>}
                </div>

                <div>
                  <label htmlFor="q19" className="block text-sm font-medium text-[#141414] mb-2">
                    19. Would you prefer a call or a written proposal next? <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="q19"
                    type="text"
                    value={formData.q19}
                    onChange={(e) => handleInputChange('q19', e.target.value)}
                    className={inputClass}
                  />
                  {errors.q19 && <p className="mt-1.5 text-xs text-red-600">{errors.q19}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <MagneticButton
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary"
                  className="w-full sm:w-auto px-10 py-4 text-sm font-semibold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Submitting…
                    </span>
                  ) : (
                    <span>Submit Answers</span>
                  )}
                </MagneticButton>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
