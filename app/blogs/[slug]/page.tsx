import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { Navbar, Footer } from '@/components/site-shell'
import { blogPosts, projects, SITE } from '@/lib/data'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

type Params = { slug: string }

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((item) => item.slug === slug)
  if (!post) return {}

  const publishedTime = new Date(post.date).toISOString()

  return {
    title: `${post.title} | ${SITE.name}`,
    description: post.excerpt,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `${SITE.url}/blogs/${post.slug}`,
      siteName: SITE.name,
      publishedTime,
      modifiedTime: publishedTime,
      images: [{ url: post.image, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const post = blogPosts.find((item) => item.slug === slug)
  if (!post) notFound()

  const postUrl = `${SITE.url}/blogs/${post.slug}`
  const datePublished = new Date(post.date).toISOString()

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished,
    dateModified: datePublished,
    image: post.image,
    author: { '@type': 'Person', name: post.author.name, url: SITE.url },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    url: postUrl,
    inLanguage: 'en-US',
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE.url}/blogs` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  }

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2)
  const index = blogPosts.findIndex((item) => item.slug === post.slug)
  const relatedProject = projects[index % projects.length]
  const toc = post.content.map((section) => ({
    heading: section.heading,
    id: slugify(section.heading),
  }))

  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#141414]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />

      <main className="relative px-5 pt-32 pb-24 sm:pt-40">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-20 left-1/2 h-[400px] w-[850px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.10)_0%,rgba(234,88,12,0.02)_50%,transparent_70%)] blur-[100px]" />
        </div>

        <article className="relative z-10 mx-auto max-w-3xl">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm text-[#5C5A55] transition-colors hover:text-[#141414]"
          >
            <ArrowLeft className="size-4" />
            All articles
          </Link>

          <header className="mt-8 space-y-5">
            <span className="inline-flex rounded-full border border-[#141414]/[0.14] bg-white/80 px-3 py-1 text-xs font-medium text-orange-600">
              {post.category}
            </span>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#141414] sm:text-5xl">
              {post.title}
            </h1>
            <p className="text-base leading-relaxed text-[#5C5A55] sm:text-lg">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#78756E]">
              <span className="font-semibold text-[#141414]">{post.author.name}</span>
              <span>{post.author.role}</span>
              <span aria-hidden="true">&bull;</span>
              <span>{post.date}</span>
              <span aria-hidden="true">&bull;</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                {post.readTime}
              </span>
            </div>
          </header>

          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-[#ECEAE3]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          <nav
            aria-labelledby="article-contents"
            className="mt-10 rounded-2xl border border-[#141414]/[0.10] bg-white/80 p-6"
          >
            <h2
              id="article-contents"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78756E]"
            >
              On this page
            </h2>
            <ol className="mt-4 space-y-2.5">
              {toc.map((entry, tocIndex) => (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    className="group flex items-baseline gap-3 text-sm text-[#2E2D2A] transition-colors hover:text-[#141414] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                  >
                    <span className="font-display text-xs tabular-nums text-orange-600">
                      {String(tocIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-[#141414]/40">
                      {entry.heading}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-12 space-y-10">
            {post.content.map((section, sectionIndex) => (
              <section
                key={section.heading}
                id={toc[sectionIndex].id}
                className="scroll-mt-28 space-y-4"
              >
                <h2 className="text-xl font-semibold tracking-tight text-[#141414] sm:text-2xl">
                  {section.heading}
                </h2>
                <p className="text-base leading-8 text-[#2E2D2A]">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-14 flex flex-col gap-5 border-t border-[#141414]/[0.10] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-full border border-orange-500/30 bg-white text-sm font-semibold text-[#141414]"
              >
                {post.author.name
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join('')}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#141414]">{post.author.name}</p>
                <p className="text-xs text-[#78756E]">
                  {post.author.role} at {SITE.name}
                </p>
              </div>
            </div>
            <Link
              href={`/work/${relatedProject.slug}`}
              className="group inline-flex items-center gap-2 text-sm font-medium text-orange-600 transition-colors hover:text-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              See this in practice: {relatedProject.title}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-16 rounded-2xl border border-[#141414]/[0.10] bg-white/85 p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-[#141414]">
              Building something similar?
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#5C5A55]">
              Book a 45-minute call and we will map the next useful step for your
              project.
            </p>
            <Link
              href="/meeting"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#141414] px-6 py-3 text-sm font-semibold text-[#F6F5F0] transition-colors hover:bg-[#262626] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141414]"
            >
              Book a call
            </Link>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78756E]">
                More from the journal
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/blogs/${item.slug}`}
                    className="rounded-2xl border border-[#141414]/[0.10] bg-white/85 p-5 shadow-sm transition-colors hover:border-orange-500/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
                  >
                    <p className="text-sm font-semibold text-[#141414]">{item.title}</p>
                    <p className="mt-2 text-xs text-[#78756E]">{item.readTime}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  )
}
