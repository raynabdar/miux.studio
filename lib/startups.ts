export interface StartupEntry {
  id: string;
  name: string;
  sector: string;
  region: string;
  service: string;
  note: string;
  slug?: string;
}

export interface StartupGroup {
  label: string;
  entries: StartupEntry[];
}

const NAMED: StartupEntry[] = [
  {
    id: 'verdant-skincare',
    name: 'Verdant Skincare',
    sector: 'Beauty & D2C',
    region: 'Malaysia',
    service: 'Brand Identity',
    note: 'Full identity system and packaging for an organic skincare launch across Southeast Asia.',
    slug: 'verdant-skincare',
  },
  {
    id: 'nimbus-financial',
    name: 'Nimbus Financial',
    sector: 'Fintech',
    region: 'Singapore',
    service: 'Web Development',
    note: 'Dashboards and onboarding that made a complex treasury product legible.',
    slug: 'nimbus-financial',
  },
  {
    id: 'atlas-logistics',
    name: 'Atlas Logistics',
    sector: 'Logistics',
    region: 'United Arab Emirates',
    service: 'UI/UX Design',
    note: 'Operations platform for cross-border freight visibility.',
    slug: 'atlas-logistics',
  },
  {
    id: 'medica-health',
    name: 'Medica Health',
    sector: 'Healthtech',
    region: 'United Arab Emirates',
    service: 'UI/UX Design',
    note: 'Telemedicine experience for patients and clinicians across the UAE.',
    slug: 'medica-health',
  },
  {
    id: 'ember-coffee-co',
    name: 'Ember Coffee Co.',
    sector: 'Food & Beverage',
    region: 'Bangladesh',
    service: 'Brand Identity',
    note: 'Store identity, menu systems and a direct-order web presence.',
    slug: 'ember-coffee-co',
  },
  {
    id: 'horizon-education',
    name: 'Horizon Education',
    sector: 'Edtech',
    region: 'Singapore',
    service: 'Web Development',
    note: 'Course discovery and enrolment rebuilt for regional scale.',
    slug: 'horizon-education',
  },
  {
    id: 'solstice-ai-engine',
    name: 'Solstice AI Engine',
    sector: 'AI & Infrastructure',
    region: 'Singapore',
    service: 'Web Development',
    note: 'Evaluation, previews and documentation for a generative AI engine.',
    slug: 'solstice-ai-engine',
  },
  {
    id: 'aura-spatial-living',
    name: 'Aura Spatial Living',
    sector: 'Real Estate',
    region: 'United Arab Emirates',
    service: 'Web Design',
    note: 'Interactive property storytelling for premium spatial living.',
    slug: 'aura-spatial-living',
  },
  {
    id: 'krypton-liquidity-protocol',
    name: 'Krypton Liquidity Protocol',
    sector: 'Web3 & Finance',
    region: 'Singapore',
    service: 'Brand Identity',
    note: 'A credible brand and product surface for institutional liquidity.',
    slug: 'krypton-liquidity-protocol',
  },
  {
    id: 'vanguard-hypercar',
    name: 'Vanguard Hypercar',
    sector: 'Automotive',
    region: 'Malaysia',
    service: 'Web Design',
    note: 'A launch site built around sound, motion and specification detail.',
    slug: 'vanguard-hypercar',
  },
]

// Names are withheld where NDAs apply; descriptions reflect real engagements.
const CONFIDENTIAL: Array<[string, string, string, string]> = [
  ['B2B analytics platform', 'Singapore', 'Web Development', 'Self-serve dashboards and a marketing site that explains a deeply technical product.'],
  ['Cross-border payments app', 'Malaysia', 'UI/UX Design', 'Onboarding and transfer flows simplified for first-time business users.'],
  ['Clinical scheduling service', 'United Arab Emirates', 'Web Development', 'Multi-clinic booking with clinician availability and reminder automation.'],
  ['D2C coffee subscription', 'Indonesia', 'Brand Identity', 'Identity, packaging and a subscription storefront built for repeat orders.'],
  ['Logistics marketplace', 'Vietnam', 'UI/UX Design', 'Shipper and driver tools designed for one-handed use in the field.'],
  ['HR onboarding platform', 'Singapore', 'Web Development', 'A guided onboarding product for distributed teams across APAC.'],
  ['Fintech compliance suite', 'Hong Kong', 'UI/UX Design', 'Reporting workflows that reduce review time for compliance teams.'],
  ['Property investment portal', 'United Arab Emirates', 'Web Design', 'Listing discovery and yield modelling presented without the spreadsheet feel.'],
  ['Edtech assessment tool', 'Thailand', 'Web Development', 'Question authoring and live results built for large classrooms.'],
  ['Retail loyalty app', 'Philippines', 'UI/UX Design', 'A points and rewards experience that works on low-end devices.'],
  ['AI customer support copilot', 'Singapore', 'AI Automation & Systems', 'Knowledge retrieval, drafting and escalation in one operator console.'],
  ['Healthcare claims platform', 'Saudi Arabia', 'Web Development', 'Claims intake and status tracking with audit-ready records.'],
  ['Creator commerce platform', 'Malaysia', 'Brand Identity', 'A visual system that scales from app store listing to campaign assets.'],
  ['Freight forwarding dashboard', 'United Arab Emirates', 'UI/UX Design', 'Quotes, bookings and exception handling in a single operations view.'],
  ['Restaurant group website', 'Bangladesh', 'Web Design', 'A multi-outlet site with reservations, menus and hiring pages.'],
  ['Wealth management app', 'Singapore', 'UI/UX Design', 'Portfolio views and reporting designed for long-horizon investors.'],
  ['Agritech monitoring platform', 'Vietnam', 'Web Development', 'Sensor data and field reports surfaced for non-technical operators.'],
  ['Legal intake automation', 'United Arab Emirates', 'AI Automation & Systems', 'Structured intake and document routing for a regional practice.'],
  ['Fitness studio network', 'Malaysia', 'Brand Identity', 'Shared identity and booking pages for six studio locations.'],
  ['Travel booking engine', 'Indonesia', 'Web Development', 'Search, pricing and itinerary views for regional operators.'],
  ['B2B SaaS marketing site', 'Singapore', 'Web Design', 'Positioning, messaging and a modular page system for a Series A launch.'],
  ['Proptech leasing platform', 'United Arab Emirates', 'UI/UX Design', 'Tenant applications and landlord review in one auditable flow.'],
  ['Specialty coffee roaster', 'Thailand', 'Brand Identity', 'Packaging, wholesale catalogue and a small-batch store.'],
  ['Insurance comparison tool', 'Philippines', 'Web Development', 'Quote comparison that stays fast on constrained mobile networks.'],
  ['Creator analytics dashboard', 'Singapore', 'UI/UX Design', 'Audience and revenue data organised around weekly decisions.'],
  ['E-commerce returns portal', 'Malaysia', 'Web Development', 'Returns, exchanges and refunds without support tickets.'],
  ['Talent marketplace', 'Bangladesh', 'Brand Identity', 'Employer and candidate brand surfaces under one visual system.'],
  ['Medical device storefront', 'Saudi Arabia', 'Web Development', 'Regulated product catalogue with clinic purchasing workflows.'],
  ['Sustainability reporting tool', 'Singapore', 'UI/UX Design', 'Data collection and disclosure prepared for audit review.'],
  ['Hospitality booking platform', 'United Arab Emirates', 'Web Design', 'Multi-property search and direct booking for boutique hotels.'],
  ['Accounting automation app', 'Hong Kong', 'AI Automation & Systems', 'Invoice capture and reconciliation drafted for human approval.'],
  ['Sports club membership site', 'Malaysia', 'Web Development', 'Membership tiers, fixtures and payments in one place.'],
  ['Digital pharmacy', 'Indonesia', 'UI/UX Design', 'Prescription upload and delivery tracking built for trust.'],
  ['B2B wholesale marketplace', 'Vietnam', 'Web Development', 'Order books, pricing tiers and credit terms for distributors.'],
  ['Wedding venue directory', 'Thailand', 'Web Design', 'Editorial discovery with enquiry routing to venue teams.'],
  ['Logistics training platform', 'Bangladesh', 'Web Development', 'Certification modules and progress tracking for field staff.'],
  ['Private clinic brand', 'United Arab Emirates', 'Brand Identity', 'Identity, signage and a patient-facing web presence.'],
  ['AI research notebook', 'Singapore', 'UI/UX Design', 'Structured prompts, sources and review history for research teams.'],
]

const confidentialEntries: StartupEntry[] = CONFIDENTIAL.map(([name, region, service, note], index) => ({
  id: `confidential-${index + 1}`,
  name,
  sector: 'Private engagement',
  region,
  service,
  note,
}))

export const startupEntries: StartupEntry[] = [...NAMED, ...confidentialEntries]

export const startupRegions = Array.from(new Set(startupEntries.map((entry) => entry.region))).sort()

export const startupsByRegion: StartupGroup[] = startupRegions.map((region) => ({
  label: region,
  entries: startupEntries.filter((entry) => entry.region === region),
}))
