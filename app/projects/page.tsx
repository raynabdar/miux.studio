'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Navbar, Footer } from '@/components/site-shell'
import { BlurRevealTitle } from '@/components/ui/blur-reveal-title'
import {
  projects,
  projectCategories,
  type Project,
  type ProjectCategory,
} from '@/lib/data'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function ProjectsPage() {
  const [filter, setFilter] = useState<ProjectCategory | 'All'>('All')
  const [selected, setSelected] = useState<Project | null>(null)

  const filteredProjects =
    filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />

      <main className="relative pt-36 pb-28 px-5 overflow-hidden">
        {/* Ambient Warm Lighting */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.14)_0%,rgba(234,88,12,0.03)_50%,transparent_70%)] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px]">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-orange-400">
              <Sparkles className="size-3 text-orange-400" />
              <span>Selected Portfolio</span>
            </span>

            <BlurRevealTitle as="h1" className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.06em] text-white">
              Crafted for Impact
            </BlurRevealTitle>

            <p className="text-base sm:text-lg text-[#A3A3A3] leading-relaxed max-w-xl mx-auto">
              Explore our multidisciplinary work across brand systems, custom digital products, and high-converting platforms.
            </p>

            {/* Category Filter Pills */}
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
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    filter === cat
                      ? 'border border-white bg-white text-[#141414] font-semibold'
                      : 'border border-white/[0.12] bg-white/[0.02] text-[#A3A3A3] hover:border-white/30 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
          >
            <AnimatePresence>
              {filteredProjects.map((project, idx) => (
                <motion.article
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  onClick={() => setSelected(project)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/[0.12] bg-[#161616] transition-all duration-300 hover:border-orange-500/40 select-none flex flex-col justify-between"
                >
                  {/* Image container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1A1A1A]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/40 to-transparent" />

                    <div className="absolute top-4 left-4 z-10">
                      <span className="rounded-full border border-white/[0.16] bg-[#141414]/80 backdrop-blur-md px-3.5 py-1 text-xs font-medium uppercase tracking-wider text-orange-200">
                        {project.category}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="size-10 rounded-full bg-white flex items-center justify-center text-black">
                        <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white group-hover:text-orange-100 transition-colors">
                        {project.title}
                      </h2>
                      <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A3A3A3] line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        {project.services.slice(0, 3).map((service) => (
                          <span
                            key={service}
                            className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs text-[#8A8A8A]"
                          >
                            {service}
                          </span>
                        ))}
                      </div>

                      <span className="text-xs font-semibold text-white group-hover:text-orange-400 transition-colors whitespace-nowrap">
                        View Study &rarr;
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Modal Dialog for Project Details */}
        <Dialog
          open={Boolean(selected)}
          onOpenChange={(open) => !open && setSelected(null)}
        >
          <DialogContent className="border-white/[0.12] bg-[#1A1A1A] text-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#707070]">
                {selected?.category}
              </span>
              <DialogTitle className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mt-1">
                {selected?.title}
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed text-[#A3A3A3] mt-3">
                {selected?.description}
              </DialogDescription>
            </DialogHeader>

            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141414] my-2">
              {selected && (
                <Image
                  src={selected.image}
                  alt={selected.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 700px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="space-y-4 pt-2 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#707070]">
                  Services Delivered
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected?.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 text-xs text-[#A3A3A3]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/[0.08] pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#707070]">
                  Measurable Impact
                </p>
                <p className="mt-1.5 text-base leading-relaxed text-[#D4D4D4]">
                  {selected?.result}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <a
                href="/meeting"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#141414] transition-opacity hover:opacity-90"
              >
                <span>Discuss Your Project</span>
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  )
}
