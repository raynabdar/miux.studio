import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Navbar, Footer } from '@/components/site-shell'
import { blogPosts, projects, SITE } from '@/lib/data'
import { getNextProject, getProjectBySlug, workDetails } from '@/lib/work'

type Params = { slug: string }

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}

  return {
    title: `${project.title} — ${project.category} Case Study | ${SITE.name}`,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: 'article',
      title: `${project.title} — ${project.category} Case Study`,
      description: project.description,
      url: `${SITE.url}/work/${project.slug}`,
      siteName: SITE.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} — ${project.category} Case Study`,
      description: project.description,
    },
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  const detail = workDetails[slug]
  if (!project || !detail) notFound()

  const nextProject = getNextProject(slug)
  const relatedPost = detail.relatedPost
    ? blogPosts.find((post) => post.slug === detail.relatedPost)
    : undefined

  const workJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: detail.brief[0],
    image: project.image,
    about: project.category,
    keywords: project.services.join(', '),
    creator: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    mainEntityOfPage: `${SITE.url}/work/${project.slug}`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE.url}/work` },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: `${SITE.url}/work/${project.slug}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#141414]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />

      <main>
        <article>
          <header className="relative">
            <div className="relative h-[56vh] min-h-[420px] w-full overflow-hidden bg-[#ECEAE3]">
              <Image
                src={project.image}
                alt={`${project.title} — ${project.category} project by Miux Studio`}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#F6F5F0] via-[#F6F5F0]/55 to-transparent" />
            </div>

            <div className="relative mx-auto -mt-28 max-w-[1100px] px-5">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 text-sm text-[#5C5A55] transition-colors hover:text-[#141414] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141414]"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                All work
              </Link>

              <div className="mt-6 space-y-5">
                <span className="inline-flex rounded-full border border-[#141414]/[0.14] bg-white/85 px-3.5 py-1 text-xs font-medium uppercase tracking-[0.18em] text-orange-600 backdrop-blur-md">
                  {project.category}
                </span>
                <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#141414] sm:text-6xl lg:text-7xl">
                  {project.title}
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-[#5C5A55] sm:text-lg">
                  {project.description}
                </p>
              </div>
            </div>
          </header>

          <div className="sticky top-[72px] z-20 mt-12 border-y border-[#141414]/[0.08] bg-[#F6F5F0]/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-[1100px] flex-nowrap items-center gap-x-6 overflow-x-auto px-5 py-3.5 sm:gap-x-10 sm:py-4 [scrollbar-width:none]">
              {detail.outcomes.map((outcome) => (
                <div key={outcome.label} className="flex shrink-0 items-baseline gap-2.5 whitespace-nowrap">
                  {outcome.value && (
                    <span className="font-display text-2xl tabular-nums text-orange-600 sm:text-3xl">
                      {outcome.value}
                    </span>
                  )}
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#5C5A55]">
                    {outcome.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-[1100px] px-5 pb-24 pt-16">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-20">
              <div className="space-y-5">
                <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
                  The brief
                </h2>
                {detail.brief.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8 text-[#2E2D2A] sm:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>

              <aside className="space-y-8">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#78756E]">
                    Services
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.services.map((service) => (
                      <li
                        key={service}
                        className="rounded-full border border-[#141414]/[0.10] bg-white/80 px-3 py-1.5 text-xs text-[#5C5A55]"
                      >
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                {relatedPost && (
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#78756E]">
                      Read more
                    </h2>
                    <Link
                      href={`/blogs/${relatedPost.slug}`}
                      className="group mt-4 block rounded-2xl border border-[#141414]/[0.10] bg-white/85 p-5 shadow-sm transition-colors hover:border-orange-500/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
                    >
                      <p className="text-sm font-semibold text-[#141414] group-hover:text-orange-600">
                        {relatedPost.title}
                      </p>
                      <p className="mt-2 text-xs text-[#5C5A55]">{relatedPost.readTime}</p>
                    </Link>
                  </div>
                )}
              </aside>
            </div>

            <section aria-labelledby="outcomes-heading" className="mt-20">
              <h2
                id="outcomes-heading"
                className="text-xs font-semibold uppercase tracking-[0.22em] text-[#78756E]"
              >
                Outcomes
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {detail.outcomes.map((outcome) => (
                  <div
                    key={outcome.label}
                    className="rounded-2xl border border-[#141414]/[0.10] bg-white/85 p-6 shadow-sm"
                  >
                    {outcome.value && (
                      <p className="font-display text-4xl tabular-nums text-[#141414]">
                        {outcome.value}
                      </p>
                    )}
                    <p className="mt-3 text-sm font-semibold text-[#141414]">{outcome.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#5C5A55]">{outcome.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-20 rounded-3xl border border-[#141414]/[0.10] bg-white/85 p-8 text-center shadow-sm sm:p-12">
              <p className="font-display text-2xl text-[#141414] sm:text-3xl">
                Building something similar?
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#5C5A55]">
                Book a 45-minute call and we will map the next useful step for your project.
              </p>
              <Link
                href="/meeting"
                className="mt-7 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#141414] px-7 py-3 text-sm font-semibold text-[#F6F5F0] transition-colors hover:bg-[#262626] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141414]"
              >
                Book a call
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <Link
              href={`/work/${nextProject.slug}`}
              className="group mt-16 flex items-center justify-between gap-6 rounded-2xl border border-[#141414]/[0.10] bg-white/85 p-6 shadow-sm transition-colors hover:border-orange-500/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#78756E]">Next project</p>
                <p className="mt-2 text-xl font-semibold text-[#141414] group-hover:text-orange-600 sm:text-2xl">
                  {nextProject.title}
                </p>
              </div>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#141414]/[0.14] text-[#141414] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <ArrowUpRight className="size-5" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
