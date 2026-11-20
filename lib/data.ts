/* ─────────────────────────────────────────────────────────────
   lib/data.ts — Central typed data for Miux Studio
   ───────────────────────────────────────────────────────────── */

// ── Site Configuration ────────────────────────────────────────
// Single source of truth for contact details and the public domain.
// `whatsapp` is intentionally empty until the real number is supplied;
// every surface that uses it renders conditionally.
export const SITE = {
  name: 'Miux Studio',
  url: 'https://www.miux.studio',
  email: 'hello@miux.studio',
  phone: '+880 1848344337',
  phoneTel: '+8801848344337',
  whatsapp: '',
  locality: 'Dhaka',
  country: 'BD',
  region: 'Bangladesh',
  areaServed: ['Asia', 'United Arab Emirates'],
  scopeLabel: 'Bangladesh-based, serving APAC and the UAE',
  founded: 2016,
} as const

export const SOCIAL_LINKS = [
  { label: 'X', href: 'https://x.com/miuxhq' },
  { label: 'Instagram', href: 'https://instagram.com/miuxhq' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/miuxhq' },
  { label: 'Facebook', href: 'https://facebook.com/miuxhq' },
] as const

export const LEGAL = {
  entity: 'Miux Studio',
  address: 'Dhaka, Bangladesh',
  governingLaw: 'the laws of Bangladesh',
  lastUpdated: '19 November 2026',
} as const

// Keep the hero pill, the impact numbers and the copy in sync.
export const STATS = {
  founders: 40,
  projects: 150,
  industries: 40,
  inHousePercent: 100,
} as const

// ── Types ─────────────────────────────────────────────────────

export type ProjectCategory =
  | 'Brand Identity'
  | 'Web Design'
  | 'Web Development'
  | 'UI/UX'
  | 'Ads and Campaigns'

export type Project = {
  id: string
  slug: string
  title: string
  category: ProjectCategory
  description: string
  result: string
  services: string[]
  image: string
}

export type FAQ = {
  id: string
  number: string
  question: string
  answer: string
}

// ── Projects ──────────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: '1',
    slug: 'verdant-skincare',
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
    slug: 'nimbus-financial',
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
    slug: 'atlas-logistics',
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
    slug: 'medica-health',
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
    slug: 'ember-coffee-co',
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
    slug: 'horizon-education',
    title: 'Horizon Education',
    category: 'Brand Identity',
    description:
      'Brand identity and digital presence for an ed-tech startup building AI-powered learning tools for universities in South and Southeast Asia.',
    result:
      'The refreshed brand helped the company close its seed round and secure partnerships with several leading universities in the region.',
    services: ['Brand Identity', 'Web Design', 'Pitch Deck Design', 'Content Strategy'],
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '7',
    slug: 'solstice-ai-engine',
    title: 'Solstice AI Engine',
    category: 'Web Development',
    description:
      'Next-generation AI research platform with real-time model telemetry, interactive neural playground, and distributed compute dashboard.',
    result:
      'Over 120,000 developers onboarded within 60 days of launch with zero downtime under peak global inference workloads.',
    services: ['Full-Stack Next.js', 'WebGL Shaders', 'Real-Time Telemetry', 'Design System'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '8',
    slug: 'aura-spatial-living',
    title: 'Aura Spatial Living',
    category: 'Web Design',
    description:
      'Immersive e-commerce and 3D architectural showcase for a luxury Scandinavian interior design collective.',
    result:
      'Average order value grew by 48% following the launch of interactive 3D room styling and fluid motion navigations.',
    services: ['E-Commerce UX', '3D Configurator', 'Motion Direction', 'Performance Tuning'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '9',
    slug: 'krypton-liquidity-protocol',
    title: 'Krypton Liquidity Protocol',
    category: 'UI/UX',
    description:
      'Institutional decentralized trading interface engineering complex order book visualization into an effortless, ultra-responsive experience.',
    result:
      'Processed over $1.4B in quarterly transaction volume with flawless usability benchmarks across institutional trading desks.',
    services: ['Trading Interface UI', 'Data Visualization', 'User Research', 'Mobile Responsive'],
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: '10',
    slug: 'vanguard-hypercar',
    title: 'Vanguard Electric Hypercar',
    category: 'Ads and Campaigns',
    description:
      'Global teaser campaign, interactive digital reveal experience, and VIP reservation funnel for a next-gen electric hypercar launch.',
    result:
      'All 500 limited-edition launch tier allocations fully reserved within 18 minutes of global streaming premiere.',
    services: ['Launch Campaign', 'Interactive 3D Reveal', 'Reservation Funnel', 'Motion Graphics'],
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
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

// ── Blog Posts ────────────────────────────────────────────────

export type BlogSection = {
  heading: string
  body: string
}

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  image: string
  author: {
    name: string
    role: string
  }
  content: BlogSection[]
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'design-systems-that-scale',
    title: 'Why Most Modern Design Systems Break at Scale (and How to Fix It)',
    excerpt:
      'A design system is only as valuable as its engineering velocity. Here is how we build living, tokenized component architectures that survive hypergrowth.',
    date: 'Nov 12, 2026',
    readTime: '6 min read',
    category: 'Design Systems',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Arif Hasan',
      role: 'Creative Director',
    },
    content: [
      {
        heading: 'Tokens are the contract',
        body: 'Most systems break because the token layer is treated as documentation instead of an API. When colour, spacing and type are consumed as named decisions rather than raw values, a rebrand becomes a config change instead of a three-month audit. Treat every token as a versioned public interface and the rest of the system has something stable to depend on.',
      },
      {
        heading: 'Components rot without a governance model',
        body: 'Coverage charts look healthy long after a library has drifted. The real question is who is allowed to add a variant, what justifies a new one, and when one gets deprecated. A lightweight review ritual — one owner, a written rule for exceptions, a quarterly prune — keeps a library from becoming a museum of one-off fixes.',
      },
      {
        heading: 'Measure adoption, not component count',
        body: 'A system with forty components and twenty percent adoption is a design project. A system with twelve components used across every surface is infrastructure. Instrument which components ship in production, which get forked, and which get bypassed; that signal tells you where the next investment belongs far better than a library screenshot.',
      },
      {
        heading: 'Start with the three screens you rebuild most',
        body: 'The fastest path to value is not a full audit. Find the three screens your team rebuilds every quarter and systemise those first. You earn credibility with shipping teams, learn the real constraints, and avoid designing abstractions for problems you have not yet met.',
      },
    ],
  },
  {
    id: '2',
    slug: 'crafting-high-conversion-websites',
    title: 'The Anatomy of a High-Converting B2B & Startup Website in 2026',
    excerpt:
      'Flashy visuals alone do not drive pipeline. Discover the visual hierarchy, micro-interactions, and message architectures that turn passive visitors into qualified leads.',
    date: 'Nov 8, 2026',
    readTime: '8 min read',
    category: 'Conversion & UX',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Nadia Rahman',
      role: 'Lead Designer',
    },
    content: [
      {
        heading: 'Lead with the problem, not the feature list',
        body: 'Buyers arrive with a specific, usually expensive problem. A homepage that opens with company history or a capability grid asks them to do the translation work themselves. Name the problem in the first sentence, in their vocabulary, and the rest of the page has somewhere to land.',
      },
      {
        heading: 'One primary action per page',
        body: 'Every additional call to action splits attention. Pick the single next step that matters — book a call, start a trial, read the case study — and let everything else recede visually. Secondary paths can exist, but they should look secondary.',
      },
      {
        heading: 'Proof beats adjectives',
        body: 'A named client, a before-and-after number, a screenshot of the actual product: these outperform words like seamless, robust and world-class every time. If real proof is not available yet, say less and show the work honestly rather than dressing up a placeholder.',
      },
      {
        heading: 'Performance is a conversion feature',
        body: 'A hero that paints after two seconds of shader warm-up has already lost part of the audience. Measure Largest Contentful Paint on a mid-range phone on 4G, not on a laptop. Motion is worth keeping only when it earns the milliseconds it costs.',
      },
    ],
  },
  {
    id: '3',
    slug: 'future-of-webgl-in-brand-storytelling',
    title: 'Beyond the Gimmick: WebGL and Shaders for Meaningful Brand Identity',
    excerpt:
      'Interactive canvas experiences can feel heavy if not engineered carefully. We unpack performance budgets, GLSL tricks, and subtle storytelling mechanics.',
    date: 'Oct 29, 2026',
    readTime: '5 min read',
    category: 'Creative Tech',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Kamal Uddin',
      role: 'Senior Developer',
    },
    content: [
      {
        heading: 'Motion should explain, not decorate',
        body: 'A shader that reacts to a product’s texture can teach someone what the material feels like. A particle field behind a headline teaches them nothing. Before adding a canvas experience, write down the sentence it helps a visitor understand; if that sentence is weak, the effect is decoration.',
      },
      {
        heading: 'Budget the GPU like you budget JavaScript',
        body: 'WebGL competes with scrolling, video and every other layer on the page. Cap the device pixel ratio, pause rendering when the canvas leaves the viewport, and ship a static poster for reduced-motion and low-power devices. A beautiful scene that drops frames on a mid-range phone is a bug, not a feature.',
      },
      {
        heading: 'Design the fallback first',
        body: 'The most reliable version of a WebGL section is the one that still communicates when the context fails. Build the typographic and photographic layout first, then let the canvas enhance it. That ordering keeps the experience honest, keeps accessibility intact, and makes the effect optional rather than load-bearing.',
      },
    ],
  },
  {
    id: '4',
    slug: 'brand-strategy-for-apac-founders',
    title: 'Navigating Cross-Border Brand Expansion Across Asia and the UAE',
    excerpt:
      'Cultural nuances, multilingual interfaces, and localized digital trust signals required when taking an ambitious startup regional.',
    date: 'Oct 15, 2026',
    readTime: '7 min read',
    category: 'Brand Strategy',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Priya Sharma',
      role: 'Brand Strategist',
    },
    content: [
      {
        heading: 'Localise the proof, not just the language',
        body: 'Translation is the easy part. A brand entering a new market needs references that market recognises: local customers, local payment methods, local support hours. Trust is built from evidence a buyer can verify, and evidence rarely survives a straight translation.',
      },
      {
        heading: 'Design for right-to-left before you need it',
        body: 'Retrofitting RTL support after launch means auditing every margin, icon direction and animation. Building with logical properties and direction-agnostic spacing from day one costs almost nothing and removes a launch blocker when the Gulf becomes a priority.',
      },
      {
        heading: 'Payments and trust signals are part of the brand',
        body: 'A beautifully designed checkout that only accepts international cards tells a regional customer the product was not built for them. Currency, invoicing, tax display and local dispute expectations belong in the brand brief, not in a later engineering ticket.',
      },
      {
        heading: 'Keep one source of truth across regions',
        body: 'Cross-border expansion fails quietly when each market maintains its own deck, screenshots and claims. A single maintained library of product truth, with region-specific layers on top, keeps the story consistent while letting the evidence change.',
      },
    ],
  },
]
