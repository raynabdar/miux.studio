import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { Navbar, Footer } from '@/components/site-shell'
import BlogPostBody from '@/components/blog-post-body'
import { SITE } from '@/lib/data'
import { getPostBySlug, getPublishedPosts } from '@/lib/cms/queries'

type Params = { slug: string }

export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const title = post.seoTitle || `${post.title} | ${SITE.name}`
  const description = post.seoDescription || post.excerpt
  const images = post.image ? [{ url: post.image, alt: post.title }] : undefined

  return {
    title,
    description,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${SITE.url}/blogs/${post.slug}`,
      siteName: SITE.name,
      publishedTime: post.date,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.image ? [post.image] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const all = await getPublishedPosts()
  const related = all.filter((item) => item.slug !== post.slug).slice(0, 2)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: post.image || undefined,
    author: { '@type': 'Person', name: post.author.name, url: SITE.url },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}/blogs/${post.slug}` },
    url: `${SITE.url}/blogs/${post.slug}`,
    inLanguage: 'en-US',
  }

  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#141414]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navbar />
      <main className="relative px-5 pt-32 pb-24">
        <article className="mx-auto w-full max-w-3xl">
          <Link
            href="/blogs"
            className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-[#5C5A55] hover:text-orange-700"
          >
            <ArrowLeft className="size-3.5" /> All posts
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-[#8A857C]">
            {post.category && <span>{post.category}</span>}
            {post.readTime && (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" /> {post.readTime}
              </span>
            )}
            <span>{post.date}</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-[#5C5A55]">{post.excerpt}</p>
          <p className="mt-6 text-xs text-[#8A857C]">
            By {post.author.name}
            {post.author.role ? ` · ${post.author.role}` : ''}
          </p>

          {post.image && (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[28px] border border-[#141414]/10">
              <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" priority className="object-cover" />
            </div>
          )}

          <div className="mt-10">
            <BlogPostBody blocks={post.blocks} />
          </div>
        </article>

        {related.length > 0 && (
          <aside className="mx-auto mt-16 w-full max-w-3xl border-t border-[#141414]/10 pt-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#8A857C]">Keep reading</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/blogs/${item.slug}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#141414]/10 bg-white/70 px-4 py-3 text-sm font-semibold hover:border-orange-500/40"
                  >
                    <span>{item.title}</span>
                    <ArrowRight className="size-4 shrink-0 text-orange-600" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </main>
      <Footer />
    </div>
  )
}
