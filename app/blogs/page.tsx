import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/site-shell'
import BlogList, { type BlogCard } from '@/components/blog-list'
import { getPublishedPosts } from '@/lib/cms/queries'

export const metadata: Metadata = {
  title: 'Journal | Miux Studio',
  description:
    'Field notes on brand design systems, digital architecture, and creative engineering from Miux Studio.',
  alternates: { canonical: '/blogs' },
}

export default async function BlogsPage() {
  const posts = await getPublishedPosts()
  const cards: BlogCard[] = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    image: post.image,
    readTime: post.readTime,
    date: post.date,
  }))

  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#141414]">
      <Navbar />
      <main className="relative pt-36 pb-28 px-5 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[850px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.10)_0%,rgba(234,88,12,0.02)_50%,transparent_70%)] blur-[100px]" />
        </div>
        <BlogList posts={cards} />
      </main>
      <Footer />
    </div>
  )
}
