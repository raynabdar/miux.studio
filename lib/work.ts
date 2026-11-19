import { projects, type Project } from './data'

export type WorkOutcome = {
  value?: string
  label: string
  detail: string
}

export type WorkDetail = {
  brief: string[]
  outcomes: WorkOutcome[]
  relatedPost?: string
}

export const workDetails: Record<string, WorkDetail> = {
  'verdant-skincare': {
    brief: [
      'Verdant Skincare came to the studio ahead of a Southeast Asian launch with a strong product and no visual language. The brief was to build an identity that could hold its own on a shelf next to established premium skincare brands — without borrowing their codes.',
      'We rebuilt the brand from the ground up: wordmark and monogram, a restrained typographic palette, a packaging system and a guidelines document the team could apply without us. The system had to survive photography, print, marketplace listings and a first website.',
    ],
    outcomes: [
      { label: 'First production run', detail: 'Sold out following launch.' },
      { label: 'Regional coverage', detail: 'Earned placement in Southeast Asian beauty publications.' },
      { label: 'System handover', detail: 'Packaging and brand guidelines delivered for in-house rollout.' },
    ],
    relatedPost: 'brand-strategy-for-apac-founders',
  },
  'nimbus-financial': {
    brief: [
      'Nimbus needed to speak to two audiences at once: institutional clients who read a website as a risk signal, and retail users who needed the product to feel approachable. The existing site did neither well.',
      'We redesigned around clarity — a single narrative path, service pages built on proof rather than adjectives, and a component system the team could extend as the product grew.',
    ],
    outcomes: [
      { label: 'Qualified enquiries', detail: 'Consultation requests rose significantly in the first quarter after launch.' },
      { label: 'Deeper engagement', detail: 'Visitors spent considerably more time on key service pages.' },
      { label: 'Reusable system', detail: 'A component library and content patterns handed to the internal team.' },
    ],
    relatedPost: 'design-systems-that-scale',
  },
  'atlas-logistics': {
    brief: [
      'Atlas ran freight operations across several countries on spreadsheets and a legacy portal. Dispatch, tracking and reporting lived in different places, and every new lane added coordination cost.',
      'We built a single operational web application — shipments, live tracking, exception handling and automated reporting — with an interface designed for people who use it for eight hours a day.',
    ],
    outcomes: [
      { label: 'Processing time', detail: 'Dropped dramatically across the dispatch workflow.' },
      { label: 'Volume without headcount', detail: 'The operations team handled a much larger shipment volume without adding staff.' },
      { label: 'One system', detail: 'Dispatch, tracking and reporting consolidated into a single interface.' },
    ],
    relatedPost: 'design-systems-that-scale',
  },
  'medica-health': {
    brief: [
      "Medica's telemedicine platform served patients and clinicians across the UAE, but booking and in-call flows leaked users at every step. The product worked; the experience did not.",
      'We ran research with both sides, rebuilt the booking flow, and redesigned the consultation interface so patients could prepare and clinicians could document without leaving the call.',
    ],
    outcomes: [
      { label: 'Onboarding completion', detail: 'Improved substantially after the flow rebuild.' },
      { label: 'Consultation sessions', detail: 'Became more consistent and efficient.' },
      { label: 'Shared interface', detail: 'Patient and clinician journeys designed against the same information model.' },
    ],
  },
  'ember-coffee-co': {
    brief: [
      'Ember was opening new locations and needed a campaign that could travel across social, search and in-store without feeling like a template.',
      'We handled creative direction, production and media buying: one visual idea executed across paid social, search and point of sale, with weekly reporting tied to foot traffic.',
    ],
    outcomes: [
      { label: 'Return on ad spend', detail: 'Strong ROAS across a multi-channel launch campaign.' },
      { label: 'Retail and online growth', detail: 'Measurable foot traffic to new locations and growth in the subscriber base.' },
      { label: 'One creative idea', detail: 'Executed consistently from feed to storefront.' },
    ],
  },
  'horizon-education': {
    brief: [
      'Horizon was building AI learning tools for universities across South and Southeast Asia and needed an identity credible enough for procurement conversations.',
      'We built the brand and the digital presence together: identity, type system, pitch materials and a site structured around the questions university buyers actually ask.',
    ],
    outcomes: [
      { label: 'Seed round', detail: 'The refreshed brand supported a successful close.' },
      { label: 'University partnerships', detail: 'Secured with several leading institutions in the region.' },
      { label: 'Sales material', detail: 'Pitch decks and identity delivered as one system.' },
    ],
    relatedPost: 'brand-strategy-for-apac-founders',
  },
  'solstice-ai-engine': {
    brief: [
      'Solstice needed a research platform that made distributed model telemetry legible to engineers — live, under real load, without the interface falling apart.',
      'We designed and built the full product surface: telemetry dashboards, an interactive neural playground and a compute view, on a Next.js and WebGL stack tuned for sustained inference traffic.',
    ],
    outcomes: [
      { value: '120,000', label: 'developers onboarded', detail: 'Within 60 days of launch.' },
      { value: 'Zero', label: 'downtime', detail: 'Under peak global inference workloads.' },
      { value: '3', label: 'product surfaces', detail: 'Telemetry, playground and compute dashboard shipped as one system.' },
    ],
    relatedPost: 'future-of-webgl-in-brand-storytelling',
  },
  'aura-spatial-living': {
    brief: [
      'Aura sells considered interiors. Their old storefront showed products; it could not show how a room would feel.',
      'We built an immersive commerce experience with a 3D room configurator, editorial navigation and performance work that keeps the scene usable on mid-range hardware.',
    ],
    outcomes: [
      { value: '+48%', label: 'average order value', detail: 'After the interactive 3D styling launch.' },
      { label: 'Motion with restraint', detail: 'Navigations and configurator tuned to hold frame rate on mid-range devices.' },
      { label: 'Commerce intact', detail: 'Configurator built on top of the existing catalogue and checkout.' },
    ],
  },
  'krypton-liquidity-protocol': {
    brief: [
      'Institutional trading interfaces fail on density: too much data, too little hierarchy, and no tolerance for latency.',
      'We designed an order book and liquidity view that stays readable at speed, tested it with trading desks, and rebuilt the mobile experience around the same information model.',
    ],
    outcomes: [
      { value: '$1.4B', label: 'quarterly volume', detail: 'Processed through the interface.' },
      { label: 'Usability benchmarks', detail: 'Met across institutional trading desks.' },
      { label: 'One model', detail: 'Desktop and mobile share the same data hierarchy.' },
    ],
  },
  'vanguard-hypercar': {
    brief: [
      'A hypercar launch lives or dies in minutes. Vanguard needed a global reveal that could carry a cinematic moment and convert it into reservations immediately.',
      'We built the teaser campaign, the interactive digital reveal and the reservation funnel as one continuous experience, with infrastructure provisioned for a simultaneous global audience.',
    ],
    outcomes: [
      { value: '500', label: 'launch allocations', detail: 'Reserved within 18 minutes of the global premiere.' },
      { label: 'One funnel', detail: 'From teaser through reveal to reservation, built as a single path.' },
      { label: 'Global load', detail: 'Provisioned for a simultaneous worldwide audience.' },
    ],
  },
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function getNextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug)
  return projects[(index + 1) % projects.length]
}
