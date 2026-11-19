'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Navbar, Footer } from '@/components/site-shell'
import { BlurRevealTitle } from '@/components/ui/blur-reveal-title'
import { projects, projectCategories, type ProjectCategory } from '@/lib/data'

export default function WorkPage() {
  const [filter, setFilter] = useState<ProjectCategory | 'All'>('All')

  const filteredProjects =
    filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#141414]">
      <Navbar />

      <main className="relative overflow-hidden px-5 pb-28 pt-36">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-20 h-[450px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.12)_0%,rgba(234,88,12,0.03)_50%,transparent_70%)] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px]">
          <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#141414]/[0.12] bg-white/80 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-orange-600">
              <Sparkles className="size-3 text-orange-600" aria-hidden="true" />
              <span>Selected Portfolio</span>
            </span>

            <BlurRevealTitle
              as="h1"
              className="text-4xl font-semibold tracking-[-0.06em] text-[#141414] sm:text-6xl md:text-7xl"
            >
              Crafted for Impact
            </BlurRevealTitle>

            <p className="mx-auto max-w-xl text-base leading-relaxed text-[#5C5A55] sm:text-lg">
              Explore our multidisciplinary work across brand systems, custom digital products, and
              high-converting platforms.
            </p>

            <div
              className="flex flex-wrap items-center justify-center gap-2 pt-6"
              role="tablist"
              aria-label="Filter portfolio projects"
            >
              {projectCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={filter === cat}
                  onClick={() => setFilter(cat)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 ${
                    filter === cat
                      ? 'border border-[#141414] bg-[#141414] font-semibold text-[#F6F5F0]'
                      : 'border border-[#141414]/[0.12] bg-white/75 text-[#5C5A55] hover:border-[#141414]/35 hover:text-[#141414]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                >
                  <Link
                    href={`/work/${project.slug}`}
                    aria-label={`View case study: ${project.title}`}
                    className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[#141414]/[0.10] bg-white/85 shadow-sm transition-all duration-300 hover:border-orange-500/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECEAE3]">
                      <Image
                        src={project.image}
                        alt={`${project.title} — ${project.category} project by Miux Studio`}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                      <div className="absolute left-4 top-4 z-10">
                        <span className="rounded-full border border-white/25 bg-[#141414]/75 px-3.5 py-1 text-xs font-medium uppercase tracking-wider text-orange-200 backdrop-blur-md">
                          {project.category}
                        </span>
                      </div>
                      <div className="absolute right-4 top-4 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="flex size-10 items-center justify-center rounded-full bg-[#141414] text-[#F6F5F0]">
                          <ArrowUpRight
                            className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between space-y-6 p-7 sm:p-8">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-[#141414] transition-colors group-hover:text-orange-600 sm:text-3xl">
                          {project.title}
                        </h2>
                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#5C5A55] sm:text-base">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t border-[#141414]/[0.08] pt-4">
                        <div className="flex flex-wrap gap-2">
                          {project.services.slice(0, 3).map((service) => (
                            <span
                              key={service}
                              className="rounded-full border border-[#141414]/[0.10] bg-[#F6F5F0] px-3 py-1 text-xs text-[#5C5A55]"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                        <span className="whitespace-nowrap text-xs font-semibold text-[#141414] transition-colors group-hover:text-orange-600">
                          View Study &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
