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
| `pnpm test` | Vitest unit tests (`tests/`) |
| `pnpm format` | Prettier write |
| `pnpm db:migrate` | `prisma migrate deploy` |
| `pnpm db:seed` | Seed settings + demo accounts |

`lint`, `typecheck`, `test`, and `build` are the CI gates.

## Accounts, onboarding, and the portal

- **Onboarding** (`/start`) collects the project brief. If the visitor picks "yes" for a meeting,
  account creation unlocks after they acknowledge the meeting step or the Cal.com webhook confirms
  the booking. The "no meeting" path never offers account creation. A founder toggle
  (`ApplicationSettings.earlySignUpEnabled`, managed at `/founder`) can open early sign-up.
- **Auth** is Clerk, scoped to `app/(portal)/` via `ClerkProvider` so marketing pages ship no Clerk
  JS. Roles are `client` and `team_member`; the founder is identified only via `FOUNDER_USER_ID`.
  Navigation preference (client/team) never grants permissions — every page re-checks the role
  server-side.
- **Verification** requires both email verification (Clerk) and owner approval (`/founder`);
  `lib/auth/status.ts` derives the account status. Suspension always wins.
- **Audit** — privileged actions and security events are written to `audit_logs`
  (`lib/security/audit.ts`).
- **Demo accounts** (`DEMO_*` env) are read-only in the UI (banner) and reset nightly by
  `/api/cron/demo-reset` (Bearer `CRON_SECRET`, see `vercel.json`).

### Client portal (Phase 2)

- **Dashboard** (`/client`) shows projects with statuses, recent updates, unread notifications,
  recent conversations, and any pending meeting request.
- **Project workspace** (`/client/projects/[id]`) shows the timeline, a conversation with the team,
  the project assistant, and meeting requests. Every read and write goes through
  `lib/portal/access.ts`, so a client can only ever load its own project.
- **Team workspace** (`/team`, `/team/projects/[id]`) lets team members publish updates and reply to
  clients. Team members only see projects they are assigned to; the founder sees all.
- **Notifications** are stored in `notifications` and surfaced in-app; email goes to the client via
  Resend. Demo accounts never receive email and cannot write.
- **Realtime** uses Supabase Realtime with Clerk as a third-party auth provider: create a Clerk JWT
  template named `supabase` and enable it in Supabase. RLS policies on `messages`/`notifications`
  compare `auth.jwt() ->> 'sub'` with ownership columns. Without Supabase configured the chat falls
  back to periodic refresh.
- **AI assistant** calls Gemini from the server only (`lib/ai/gemini.ts`) with project-scoped
  context; answers are stored as an `assistant` message. Replies never include other clients' data.
- **Meeting requests** are one-pending-per-client, enforced by a partial unique index
  (`meeting_requests_one_pending_per_client`).

### Admin dashboard (Phase 3)

- `/admin` is owner-only (`requireFounder()` on every page and server action). Middleware and hidden
  UI are never the authorization layer.
- **Clients** — cards with status; the detail page aggregates contact/company, onboarding
  submissions, projects and files, owner-only internal notes, chat history, meeting history and
  notifications. Verify/unverify takes effect immediately; role changes are limited to
  `client`/`team_member` (founder is configuration-only) and audited.
- **Meetings** — all requests with current state; "Mark as reviewed" moves `pending` → `seen`,
  notifies and emails the client, and re-enables new requests. Shared logic lives in
  `lib/meetings.ts` and is used by both `/team` and `/admin`.
- **Submissions** — all onboarding submissions with service, budget, meeting preference, booking
  state and status.
- **Audit log** — recent entries. `audit_logs` is append-only: a database trigger rejects UPDATE and
  DELETE on the table.

### CMS (Phase 4)

- `/admin/content` (owner-only) edits social links, contact details, startups, testimonials,
  pricing plans, discount announcements and blog posts. The custom-plan card is fixed in the pricing
  component and is deliberately outside the CMS.
- Content lives in dedicated tables (`site_settings`, `social_links`, `startups`, `testimonials`,
  `pricing_plans`, `discount_announcements`, `blog_posts`). Reads go through `lib/cms/queries.ts`
  with `unstable_cache` tags; every write calls `revalidateTag(tag, 'max')` plus `revalidatePath`
  for the affected routes, so live content updates without a deployment.
- Empty tables fall back to the built-in content in `lib/cms/defaults.ts`, so the site renders
  before anything is entered. `pnpm db:seed` copies that same content into the CMS tables (only
  when they are empty), so the editor starts with real rows.
- Blog posts are structured blocks (headings, paragraphs, images, quotes, code, ordered and
  unordered lists). Blocks are stored as JSON and rendered as React elements — never as injected
  HTML. Drafts and future-dated posts stay off `/blogs`; images upload to Supabase Storage via
  `SUPABASE_SERVICE_ROLE_KEY` (server-only) and bucket `SUPABASE_STORAGE_BUCKET` (default
  `cms-media`).
- The discount banner renders from `getActiveDiscount()` and only appears while an announcement is
  enabled and inside its start/end window.

### Database

Prisma with PostgreSQL (Supabase). Runtime uses the pooled `DATABASE_URL` (port 6543,
`?pgbouncer=true`); migrations use `DIRECT_URL` (port 5432). Generated client output is
`generated/prisma` (gitignored, regenerated by `postinstall`). Row Level Security is enabled on
all tables.

### Webhooks

| Endpoint | Purpose |
| --- | --- |
| `/api/webhooks/clerk` | `user.created/updated/deleted` → upsert accounts, link submissions, derive status |
| `/api/webhooks/calcom` | `BOOKING_CREATED` → set `bookingState = confirmed` (optional signature check) |

### /founder access

Two layers: a Cloudflare Access application on the `/founder` path (dashboard configuration, DNS is
on Cloudflare) and the Clerk owner check in `requireFounder()`. Configure the Clerk app to
challenge suspicious sign-ups in the Clerk dashboard.

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
| `/client`, `/client/projects/[id]` | Dynamic, `noindex` | Client portal (role `client`) |
| `/team`, `/team/projects/[id]` | Dynamic, `noindex` | Team workspace (role `team_member` / founder) |
| `/founder` | Dynamic, `noindex` | Founder panel (`FOUNDER_USER_ID`) |
| `/admin`, `/admin/clients/[clerkId]`, `/admin/meetings`, `/admin/submissions`, `/admin/audit` | Dynamic, `noindex` | Owner-only admin workspace |
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

Deploys as a standard Next.js app on Vercel. Set the Resend, Clerk, Supabase (`DATABASE_URL`,
`DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`), Upstash, Turnstile and
Gemini (`GEMINI_API_KEY`) variables in the project environment. Security headers and the
`/onboarding` `noindex` rule are configured in `next.config.mjs`. Only `images.unsplash.com` is
allowed as a remote image host.
