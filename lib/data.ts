/* ─────────────────────────────────────────────────────────────
   lib/data.ts — Central typed data for Miux Studio
   ───────────────────────────────────────────────────────────── */

// ── Types ─────────────────────────────────────────────────────

export type TeamMember = {
  id: string
  name: string
  role: string
  image: string
}

export type ProjectCategory =
  | 'Brand Identity'
  | 'Web Design'
  | 'Web Development'
  | 'UI/UX'
  | 'Ads and Campaigns'

export type Project = {
  id: string
  title: string
  category: ProjectCategory
  description: string
  result: string
  services: string[]
  image: string
}

export type PricingTier = {
  name: string
  description: string
  price: string
  features: string[]
  highlighted: boolean
  badge?: string
}

export type Testimonial = {
  id: string
  quote: string
  name: string
  role: string
  company: string
  avatar: string
}

export type FAQ = {
  id: string
  number: string
  question: string
  answer: string
}

export type SocialLink = {
  name: string
  url: string
  icon: string
}

export type ContactInfo = {
  email: string
  replyTime: string
  region: string
}

// ── Team (6 members) ──────────────────────────────────────────

export const team: TeamMember[] = [
  {
    id: '1',
    name: 'Arif Hasan',
    role: 'Founder & Creative Director',
    image: '/placeholder-user.jpg',
  },
  {
    id: '2',
    name: 'Nadia Rahman',
    role: 'Lead Designer',
    image: '/placeholder-user.jpg',
  },
  {
    id: '3',
    name: 'Kamal Uddin',
    role: 'Senior Developer',
    image: '/placeholder-user.jpg',
  },
  {
    id: '4',
    name: 'Priya Sharma',
    role: 'Brand Strategist',
    image: '/placeholder-user.jpg',
  },
  {
    id: '5',
    name: 'Daniel Park',
    role: 'UI/UX Designer',
    image: '/placeholder-user.jpg',
  },
  {
    id: '6',
    name: 'Sara Chen',
    role: 'Project Manager',
    image: '/placeholder-user.jpg',
  },
]

// ── Projects (6 projects) ─────────────────────────────────────

export const projects: Project[] = [
  {
    id: '1',
    title: 'Verdant Skincare',
    category: 'Brand Identity',
    description:
      'A full brand identity system for a premium organic skincare line launching across Southeast Asia. We built the visual language, packaging system, and brand guidelines from the ground up.',
    result:
      'The brand launched to strong early traction, earning coverage in regional beauty publications and selling out its first production run.',
    services: ['Brand Strategy', 'Visual Identity', 'Packaging Design', 'Brand Guidelines'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    title: 'Nimbus Financial',
    category: 'Web Design',
    description:
      'A complete website redesign for a fintech company looking to establish credibility with institutional clients while remaining approachable to retail users.',
    result:
      'Consultation requests increased significantly within the first quarter after launch, with visitors spending considerably more time on key service pages.',
    services: ['Web Design', 'Interaction Design', 'Responsive Design', 'Design System'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    title: 'Atlas Logistics',
    category: 'Web Development',
    description:
      'A high-performance web application for a logistics company managing freight operations across multiple countries, with real-time tracking and automated reporting.',
    result:
      'Processing times dropped dramatically, and the operations team was able to handle a much larger volume of shipments without adding headcount.',
    services: ['Web Development', 'API Integration', 'Dashboard Design', 'Performance Optimization'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    title: 'Medica Health',
    category: 'UI/UX',
    description:
      'A complete UX overhaul of a telemedicine platform serving patients and doctors across the UAE. The goal was to simplify appointment booking and in-app consultations.',
    result:
      'Patient onboarding completion rates improved substantially, and average session duration for consultations became more consistent and efficient.',
    services: ['UX Research', 'UI Design', 'Prototyping', 'Usability Testing'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '5',
    title: 'Ember Coffee Co.',
    category: 'Ads and Campaigns',
    description:
      'A multi-channel digital campaign for a specialty coffee brand expanding into new markets. We handled creative direction, ad production, and media buying across social and search.',
    result:
      'The campaign delivered a strong return on ad spend, driving meaningful foot traffic to new retail locations and growing their online subscriber base.',
    services: ['Campaign Strategy', 'Ad Creative', 'Media Buying', 'Analytics'],
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '6',
    title: 'Horizon Education',
    category: 'Brand Identity',
    description:
      'Brand identity and digital presence for an ed-tech startup building AI-powered learning tools for universities in South and Southeast Asia.',
    result:
      'The refreshed brand helped the company close its seed round and secure partnerships with several leading universities in the region.',
    services: ['Brand Identity', 'Web Design', 'Pitch Deck Design', 'Content Strategy'],
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
  },
]

// ── Project Categories ────────────────────────────────────────

export const projectCategories = [
  'All',
  'Brand Identity',
  'Web Design',
  'Web Development',
  'UI/UX',
  'Ads and Campaigns',
] as const

// ── About History (2 to 3 paragraphs) ─────────────────────────

export const aboutHistory: string[] = [
  'Miux Studio was founded on a simple conviction: digital work should drive measurable business growth, not merely serve as superficial decoration. We partner with ambitious leaders across Asia and the UAE to engineer brand systems and digital products that create definitive commercial advantages.',
  'Our multidisciplinary practice bridges brand design and identity, web design, web development, UI/UX design, and strategic ads and campaigns. By treating every customer touchpoint as an interconnected growth vehicle, we replace disjointed deliverables with cohesive, high-converting digital ecosystems.',
  'Positioned intentionally as a selective creative studio, we maintain tight partnership caps to guarantee senior-level execution on every initiative. We are trusted by global corporations and brands at scale to turn complex brand challenges into clear, enduring digital momentum.',
]

// ── Pricing Tiers (3 tiers) ───────────────────────────────────

export const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    description:
      'For focused engagements that demand strategic clarity and high-calibre visual execution.',
    price: 'Custom Scope',
    features: [
      'Core brand identity or dedicated web property',
      'End-to-end design system architecture',
      'Fully responsive, accessible build',
      'Integrated analytics & performance tuning',
      'Direct senior partner collaboration',
      'Post-launch warranty & onboarding',
    ],
    highlighted: false,
  },
  {
    name: 'Growth',
    description:
      'Comprehensive design and development engineered to accelerate market capture and conversion.',
    price: 'Partnership',
    features: [
      'Complete brand system & multi-surface web platform',
      'Advanced interactive motions & micro-interactions',
      'Custom CMS architecture & headless integrations',
      'Targeted campaign collateral & ad creatives',
      'Conversion rate optimization (CRO) setup',
      'Dedicated bi-weekly strategic sprint reviews',
    ],
    highlighted: true,
    badge: 'Most chosen',
  },
  {
    name: 'Scale',
    description:
      'Embedded creative and engineering partnership for global brands demanding category dominance.',
    price: 'Enterprise',
    features: [
      'Full-spectrum brand, web, UI/UX, and marketing ecosystem',
      'High-velocity custom software & web application engineering',
      'Omnichannel performance ads & campaign rollout',
      'Multi-region localization across Asia and the UAE',
      'Priority SLA with continuous optimization & iterations',
      'Direct Slack/Teams integration with senior team',
    ],
    highlighted: false,
  },
]

// ── Testimonials (6 testimonials) ─────────────────────────────

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      'Miux Studio transformed how our brand shows up online. The attention to detail and strategic thinking behind every decision was exactly what we needed.',
    name: 'Faisal Al-Rashid',
    role: 'CEO',
    company: 'Nimbus Financial',
    avatar: '/placeholder-user.jpg',
  },
  {
    id: '2',
    quote:
      'Working with Miux felt like having an in-house creative team. They understood our market, moved fast, and delivered work that genuinely surprised us.',
    name: 'Lin Mei',
    role: 'Head of Marketing',
    company: 'Ember Coffee Co.',
    avatar: '/placeholder-user.jpg',
  },
  {
    id: '3',
    quote:
      'The UX improvements they made to our platform had an immediate impact. Our patients and doctors both noticed the difference from day one.',
    name: 'Dr. Aisha Khalil',
    role: 'Product Lead',
    company: 'Medica Health',
    avatar: '/placeholder-user.jpg',
  },
  {
    id: '4',
    quote:
      'They do not just make things look good — they think about how design connects to business outcomes. That is rare and incredibly valuable.',
    name: 'Rajesh Patel',
    role: 'Founder',
    company: 'Horizon Education',
    avatar: '/placeholder-user.jpg',
  },
  {
    id: '5',
    quote:
      'From the first call to final delivery, everything was clear and professional. No wasted time, no surprises — just great work, delivered on schedule.',
    name: 'Sarah Lim',
    role: 'Operations Director',
    company: 'Atlas Logistics',
    avatar: '/placeholder-user.jpg',
  },
  {
    id: '6',
    quote:
      'Their selective partnership model really shows in the output. The quality of execution across our brand identity and web presence set a new standard for our industry.',
    name: 'Tariq Mansoor',
    role: 'Managing Director',
    company: 'Verdant Group',
    avatar: '/placeholder-user.jpg',
  },
  {
    id: '7',
    quote:
      'The component system and interactions they built elevated our conversion rates significantly within the first month of rollout.',
    name: 'Emma Brown',
    role: 'VP Marketing',
    company: 'Apex Digital',
    avatar: '/placeholder-user.jpg',
  },
  {
    id: '8',
    quote:
      'Implementing their design system was a game-changer for our engineering team across Southeast Asia and Dubai.',
    name: 'James Wilson',
    role: 'Chief Technology Officer',
    company: 'Veloce Labs',
    avatar: '/placeholder-user.jpg',
  },
]

// ── FAQs (6 items) ────────────────────────────────────────────

export const faqs: FAQ[] = [
  {
    id: '01',
    number: '01',
    question: 'How does the process work?',
    answer:
      'We start with a focused discovery call to understand your goals, audience, and constraints. From there, we map out a clear scope, align on milestones, and move through strategy, design, and build in structured weekly sprints. You will have full visibility into progress at every stage.',
  },
  {
    id: '02',
    number: '02',
    question: 'What timelines should we expect?',
    answer:
      'Most engagements take between four and ten weeks depending on scope, decision velocity, and the number of surfaces involved. A brand identity typically runs four to six weeks, while a full website build with custom development sits closer to eight to ten.',
  },
  {
    id: '03',
    number: '03',
    question: 'How is pricing structured?',
    answer:
      'Every engagement is scoped around the outcome you need, the system required to get there, and the level of collaboration involved. We provide a clear, fixed proposal after our initial call — no hourly billing, no surprise invoices.',
  },
  {
    id: '04',
    number: '04',
    question: 'How many revisions are included?',
    answer:
      'Each tier includes a defined number of revision rounds. We have found that clear creative direction upfront keeps revisions focused and productive. If additional rounds are needed, we are flexible and transparent about what that looks like.',
  },
  {
    id: '05',
    number: '05',
    question: 'What is it like working with Miux Studio?',
    answer:
      'You work directly with a senior, small team. Fewer layers, quicker decisions, and a shared standard for the details that matter. We communicate openly, meet deadlines, and treat your project like our own.',
  },
  {
    id: '06',
    number: '06',
    question: 'What happens on the 45-minute call?',
    answer:
      'We unpack your current situation, identify the highest-leverage opportunity, and outline what a useful next step could look like. There is no pitch — it is a genuine conversation to figure out if we are the right fit and where we can create the most impact.',
  },
]

// ── Social Links ──────────────────────────────────────────────

export const socialLinks: SocialLink[] = [
  { name: 'Facebook', url: 'https://facebook.com/Miuxstudio', icon: 'Facebook' },
  { name: 'LinkedIn', url: '#', icon: 'Linkedin' },
  { name: 'Instagram', url: '#', icon: 'Instagram' },
  { name: 'X', url: '#', icon: 'Twitter' },
]

// ── Services ──────────────────────────────────────────────────

export const services = [
  'Brand Design and Identity',
  'Web Design',
  'Web Development',
  'UI/UX Design',
  'Ads and Other Campaigns',
] as const

// ── Contact Info ──────────────────────────────────────────────

export const contactInfo: ContactInfo = {
  email: 'hello@miux.studio',
  replyTime: 'We reply within one business day.',
  region: 'Serving Asia and the UAE.',
}
