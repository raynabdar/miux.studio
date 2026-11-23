'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, Clock } from 'lucide-react'
import { BlurRevealTitle } from '@/components/ui/blur-reveal-title'

export type BlogCard = {
  slug: string
  title: string
  excerpt: string
  category: string
  image: string
  readTime: string
  date: string
}

export default function BlogList({ posts }: { posts: BlogCard[] }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))]
  const filteredPosts =
    selectedCategory === 'All' ? posts : posts.filter((p) => p.category === selectedCategory)

  return (
    <>
      <div className="relative z-10 mx-auto max-w-[1200px]">
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

          {categories.length > 1 && (
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
                  {cat || 'General'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                href={`/blogs/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#141414]/[0.08] bg-white/70 backdrop-blur-xl"
              >
                {post.image && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-[#8A857C]">
                    {post.category && <span>{post.category}</span>}
                    {post.readTime && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" /> {post.readTime}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold leading-snug tracking-tight">{post.title}</h2>
                  <p className="text-sm leading-relaxed text-[#5C5A55]">{post.excerpt}</p>
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-orange-700">
                    Read the post <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <p className="text-center text-sm text-[#8A857C]">No posts in this category yet.</p>
        )}
      </div>
    </>
  )
}
