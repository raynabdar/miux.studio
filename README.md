# Miux Studio

Marketing site for Miux Studio — a design and engineering studio based in Dhaka, Bangladesh, working with teams across APAC and the UAE.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Framer Motion, Lenis
- React Hook Form + Zod
- Resend for transactional email
- Cal.com embed for scheduling
- Vercel Analytics

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev
```

Open http://localhost:3000.

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint (flat config, `eslint-config-next`) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm format` | Prettier write |

There is no test suite; `lint`, `typecheck`, and `build` are the CI gates.

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes for forms | Resend API key |
| `CONTACT_TO_EMAIL` | Yes for forms | Inbox that receives enquiries and onboarding submissions |
| `CONTACT_FROM_EMAIL` | Yes for forms | Verified sender address in Resend |

Without these three, both form endpoints return `503` with a message telling the visitor to email directly — they never fake a success.

## Routes

| Route | Type | Notes |
| --- | --- | --- |
| `/` | Static | Hero, services, work, pricing, testimonials, FAQ |
| `/projects` | Static | Case study grid with filter and detail dialog |
| `/blogs`, `/blogs/[slug]` | Static | Journal index and authored posts |
| `/meeting` | Static | Cal.com booking embed |
| `/contact` | Static | Enquiry form → `/api/contact` |
| `/onboarding` | Static, `noindex` | Long-form client brief → `/api/onboarding` |
| `/terms`, `/client-terms`, `/privacy-policy` | Static | Legal pages |
| `/sitemap` | Static | HTML sitemap |
| `/blog`, `/privacy` | Redirects | → `/blogs`, `/privacy-policy` |
| `/sitemap.xml`, `/robots.txt` | Generated | `app/sitemap.ts`, `app/robots.ts` |

## Content and configuration

All editable copy, project data, blog posts, FAQs, stats, social links, and legal constants live in [`lib/data.ts`](lib/data.ts). Components read from it rather than carrying their own copies.

- `SITE` — name, URL, email, optional phone/WhatsApp (empty strings render nothing), locality, area served
- `SOCIAL_LINKS` — one profile per platform
- `STATS`, `LEGAL`, `faqs`, `projects`, `blogPosts`

Form validation schemas are shared between client and server in [`lib/schemas.ts`](lib/schemas.ts). Rate limiting and origin checks live in [`lib/rate-limit.ts`](lib/rate-limit.ts) and are per-instance, in-memory only — they slow casual abuse, not determined traffic.

## Deployment

Deploys as a standard Next.js app on Vercel. Set the three Resend variables in the project environment. Security headers and the `/onboarding` `noindex` rule are configured in `next.config.mjs`. Only `images.unsplash.com` is allowed as a remote image host.
