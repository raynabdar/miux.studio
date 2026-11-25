import { ProgressiveBlur } from "@/components/ProgressiveBlur";
import { Footer, Navbar } from "@/components/site-shell";
import { SITE } from "@/lib/data";
import { startupEntries } from "@/lib/startups";
import { getStartups } from "@/lib/cms/queries";
import { ArrowUpRight, Check, Globe } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Startups & Businesses We Work With | Miux Studio",
  description:
    "48+ startups and businesses across APAC and the UAE trust Miux Studio for brand identity, web design, product interfaces and AI systems. See the roster and selected case studies.",
  alternates: {
    canonical: "/startups",
  },
  openGraph: {
    title: "Startups & Businesses We Work With | Miux Studio",
    description:
      "48+ startups and businesses across APAC and the UAE trust Miux Studio for brand, web and product work.",
    url: "/startups",
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startups & Businesses We Work With | Miux Studio",
    description:
      "48+ startups and businesses across APAC and the UAE trust Miux Studio for brand, web and product work.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Startups & Businesses We Work With",
  description:
    "A roster of startups and businesses across APAC and the UAE that have worked with Miux Studio.",
  url: `${SITE.url}/startups`,
  isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
  hasPart: startupEntries
    .filter((entry) => entry.slug)
    .map((entry) => ({
      "@type": "CreativeWork",
      name: entry.name,
      url: `${SITE.url}/work/${entry.slug}`,
    })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
    {
      "@type": "ListItem",
      position: 2,
      name: "Startups & Businesses",
      item: `${SITE.url}/startups`,
    },
  ],
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const SERVICES_COVERED = [
  "Brand Identity",
  "Web Design",
  "Web Development",
  "UI/UX Design",
  "Campaigns",
  "AI Systems",
];

export default async function StartupsPage() {
  const cmsStartups = await getStartups();
  const liveEntries = cmsStartups.map((entry) => ({
    id: entry.id,
    name: entry.name,
    sector: entry.sector || "Partners",
    region: entry.region || "Global",
    service: entry.service || "Studio collaboration",
    note: entry.description,
    slug: entry.slug ?? undefined,
    logoUrl: entry.logoUrl,
  }));
  const liveGroups = Array.from(new Set(liveEntries.map((entry) => entry.region))).map((region) => ({
    label: region,
    entries: liveEntries.filter((entry) => entry.region === region),
  }));
  const startupEntries = liveEntries;
  const startupsByRegion = liveGroups;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />

      <main className="bg-[#F6F5F0] text-[#141414]">
        <section className="relative overflow-hidden px-5 pb-16 pt-32 sm:pt-40">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/2 h-[620px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.12)_0%,rgba(234,88,12,0.04)_45%,transparent_70%)] blur-[110px]"
          />
          <div className="relative mx-auto max-w-6xl">
            <nav aria-label="Breadcrumb" className="text-xs text-[#78756E]">
              <Link href="/" className="transition-colors hover:text-[#141414]">
                Home
              </Link>
              <span className="mx-2" aria-hidden="true">
                /
              </span>
              <span className="text-[#141414]">Startups &amp; Businesses</span>
            </nav>

            <p className="mt-10 font-display text-2xl italic text-orange-700">
              {startupEntries.length}+ partners
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Startups &amp; businesses that trusted us with the hard part.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#5C5A55] sm:text-lg">
              Founders, operators and product teams across APAC and the UAE.
              Some engagements are public case studies; others stay under NDA,
              so we describe the work without the name.
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-3 sm:max-w-xl sm:gap-6">
              <div className="rounded-2xl border border-[#141414]/[0.10] bg-white/80 p-4 shadow-sm backdrop-blur-xl sm:p-5">
                <dt className="text-[10px] uppercase tracking-[0.16em] text-[#78756E] sm:text-xs">
                  Partners
                </dt>
                <dd className="mt-1 font-display text-3xl tabular-nums text-[#141414] sm:text-4xl">
                  {startupEntries.length}+
                </dd>
              </div>
              <div className="rounded-2xl border border-[#141414]/[0.10] bg-white/80 p-4 shadow-sm backdrop-blur-xl sm:p-5">
                <dt className="text-[10px] uppercase tracking-[0.16em] text-[#78756E] sm:text-xs">
                  Markets
                </dt>
                <dd className="mt-1 font-display text-3xl tabular-nums text-[#141414] sm:text-4xl">
                  {startupsByRegion.length}
                </dd>
              </div>
              <div className="rounded-2xl border border-[#141414]/[0.10] bg-white/80 p-4 shadow-sm backdrop-blur-xl sm:p-5">
                <dt className="text-[10px] uppercase tracking-[0.16em] text-[#78756E] sm:text-xs">
                  Retention
                </dt>
                <dd className="mt-1 font-display text-3xl tabular-nums text-[#141414] sm:text-4xl">
                  100%
                </dd>
              </div>
            </dl>

            <ul className="mt-8 flex flex-wrap gap-2">
              {SERVICES_COVERED.map((service) => (
                <li
                  key={service}
                  className="rounded-full border border-[#141414]/[0.12] bg-white/80 px-3 py-1.5 text-xs text-[#2E2D2A]"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="roster"
          className="border-t border-[#141414]/[0.08] px-5 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <h2
              id="roster"
              className="text-2xl font-semibold tracking-tight text-[#141414] sm:text-3xl"
            >
              The roster
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5C5A55] sm:text-base">
              Organised by market. Named projects open the full case study; NDA
              engagements are described by what we built.
            </p>

            <div className="mt-12 space-y-14">
              {startupsByRegion.map((group) => (
                <div key={group.label}>
                  <div className="flex items-center gap-3">
                    <Globe
                      className="size-4 text-orange-600"
                      aria-hidden="true"
                    />
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2E2D2A]">
                      {group.label}
                    </h3>
                    <span
                      className="h-px flex-1 bg-gradient-to-r from-[#141414]/[0.14] to-transparent"
                      aria-hidden="true"
                    />
                    <span className="text-xs tabular-nums text-[#78756E]">
                      {group.entries.length}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.entries.map((entry) => {
                      const body = (
                        <>
                          <ProgressiveBlur
                            direction="top"
                            blurLayers={5}
                            blurIntensity={0.45}
                            className="pointer-events-none absolute inset-x-0 top-0 h-16 rounded-t-2xl"
                          />
                          <ProgressiveBlur
                            direction="bottom"
                            blurLayers={5}
                            blurIntensity={0.55}
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 rounded-b-2xl"
                          />
                          <div className="relative z-10 flex items-start justify-between gap-3">
                            {entry.logoUrl ? (
                              <Image
                                src={entry.logoUrl}
                                alt={`${entry.name} logo`}
                                width={40}
                                height={40}
                                className="size-10 shrink-0 rounded-full border border-[#141414]/[0.10] bg-white object-contain p-1"
                              />
                            ) : (
                              <span
                                aria-hidden="true"
                                className="grid size-10 shrink-0 place-items-center rounded-full border border-orange-500/30 bg-[#F6F5F0] text-xs font-semibold text-[#141414]"
                              >
                                {initials(entry.name)}
                              </span>
                            )}
                            {entry.slug ? (
                              <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-orange-700">
                                Case study
                              </span>
                            ) : (
                              <span className="rounded-full border border-[#141414]/[0.10] bg-[#F6F5F0] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#78756E]">
                                NDA
                              </span>
                            )}
                          </div>
                          <h4 className="relative z-10 mt-4 text-base font-semibold text-[#141414]">
                            {entry.name}
                          </h4>
                          <p className="relative z-10 mt-1 text-xs text-[#78756E]">
                            {entry.sector} · {entry.region}
                          </p>
                          <p className="relative z-10 mt-3 text-sm leading-relaxed text-[#5C5A55]">
                            {entry.note}
                          </p>
                          <div className="relative z-10 mt-4 flex items-center justify-between border-t border-[#141414]/[0.08] pt-3">
                            <span className="text-[11px] text-[#78756E]">
                              {entry.service}
                            </span>
                            {entry.slug && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 transition-colors group-hover:text-orange-500">
                                View
                                <ArrowUpRight
                                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </div>
                        </>
                      );

                      const className =
                        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#141414]/[0.10] bg-white/85 p-5 shadow-sm backdrop-blur-xl transition-all hover:border-orange-500/50 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600";

                      return entry.slug ? (
                        <Link
                          key={entry.id}
                          href={`/work/${entry.slug}`}
                          className={className}
                        >
                          {body}
                        </Link>
                      ) : (
                        <article key={entry.id} className={className}>
                          {body}
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-24">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-3xl border border-orange-500/25 bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.10),rgba(255,255,255,0.85)_60%)] p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#141414]">
                Want to be on this list?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5C5A55]">
                Tell us what you are building. We will reply with the most
                useful next step, whether that is a project or a free teardown.
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#2E2D2A]">
                <li className="inline-flex items-center gap-2">
                  <Check
                    className="size-3.5 text-orange-600"
                    aria-hidden="true"
                  />
                  Fixed monthly scope
                </li>
                <li className="inline-flex items-center gap-2">
                  <Check
                    className="size-3.5 text-orange-600"
                    aria-hidden="true"
                  />
                  Senior partner lead
                </li>
                <li className="inline-flex items-center gap-2">
                  <Check
                    className="size-3.5 text-orange-600"
                    aria-hidden="true"
                  />
                  No hourly billing
                </li>
              </ul>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/meeting"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#141414] px-7 py-3.5 text-sm font-semibold text-[#F6F5F0] transition-colors hover:bg-[#262626] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141414]"
              >
                Book a call
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/teardown"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#141414]/[0.16] bg-white/75 px-6 py-3.5 text-sm font-medium text-[#141414] transition-colors hover:border-[#141414]/35 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Free teardown
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
