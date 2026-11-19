'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, Clock } from 'lucide-react'
import { Navbar, Footer } from '@/components/site-shell'
import { BlurRevealTitle } from '@/components/ui/blur-reveal-title'
import { blogPosts } from '@/lib/data'

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))]

  const filteredPosts =
    selectedCategory === 'All'
      ? blogPosts
      : blogPosts.filter((p) => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#141414]">
      <Navbar />

      <main className="relative pt-36 pb-28 px-5 overflow-hidden">
        {/* Ambient Warm Lighting */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[850px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.10)_0%,rgba(234,88,12,0.02)_50%,transparent_70%)] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px]">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#141414]/[0.12] bg-white/80 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-orange-600">
              <BookOpen className="size-3 text-orange-600" />
              <span>Studio Insights &amp; Journal</span>
            </span>

            <BlurRevealTitle as="h1" className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.06em] text-[#141414]">
              Thoughts on Craft &amp; Growth
            </BlurRevealTitle>

            <p className="text-base sm:text-lg text-[#5C5A55] leading-relaxed max-w-xl mx-auto">
              Field notes on brand design systems, high-converting digital architecture, and creative engineering.
            </p>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'border border-[#141414] bg-[#141414] text-[#F6F5F0] font-semibold'
                      : 'border border-[#141414]/[0.12] bg-white/75 text-[#5C5A55] hover:border-[#141414]/35 hover:text-[#141414]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#141414]/[0.10] bg-white/85 p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-orange-500/50 hover:shadow-md focus-within:border-orange-500/50"
              >
                <Link
                  href={`/blogs/${post.slug}`}
                  aria-label={`Read ${post.title}`}
                  className="absolute inset-0 z-20 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                />
                <div>
                  {/* Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#ECEAE3] mb-6">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-4 left-4 z-10">
                      <span className="rounded-full border border-white/25 bg-[#141414]/75 backdrop-blur-md px-3 py-1 text-xs font-medium text-orange-200">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-[#78756E] mb-3">
                    <span>{post.date}</span>
                    <span>&bull;</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#141414] group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#5C5A55] line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Author & Read action */}
                <div className="mt-8 pt-5 border-t border-[#141414]/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-[#ECEAE3] border border-[#141414]/[0.10] flex items-center justify-center font-semibold text-xs text-[#141414]">
                      {post.author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#141414]">{post.author.name}</p>
                      <p className="text-[11px] text-[#78756E]">{post.author.role}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 group-hover:text-orange-500 transition-colors">
                    <span>Read Article</span>
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-20 rounded-3xl border border-[#141414]/[0.10] bg-white/85 shadow-sm p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#141414]">
              Have a project in mind?
            </h3>
            <p className="text-sm sm:text-base text-[#5C5A55] max-w-lg mx-auto">
              We publish occasionally. If you would rather talk about your own brand
              or product, book a 45-minute call and we will map the next step.
            </p>
            <Link
              href="/meeting"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#141414] px-7 text-sm font-semibold text-[#F6F5F0] transition-colors hover:bg-[#262626] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141414]"
            >
              Book a call
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
