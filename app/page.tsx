import HomeContent from '@/components/home-content'
import { getPricingPlans, getTestimonials } from '@/lib/cms/queries'

export default async function HomePage() {
  const [plans, testimonials] = await Promise.all([getPricingPlans(), getTestimonials()])
  return <HomeContent plans={plans} testimonials={testimonials} />
}
