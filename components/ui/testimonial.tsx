"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

function ClientFeedback({ className }: { className?: string }) {
  return (
    <section
      id="testimonials"
      aria-label="Client testimonials"
      className={cn("w-full bg-transparent text-white py-24 sm:py-32 px-5", className)}
    >
      {/* The entire section renders as a single unified block with smooth blur lazy load */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(14px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-full max-w-7xl mx-auto rounded-2xl"
      >
        <article className="max-w-screen-md mx-auto text-center space-y-3 mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-[#707070]">
            04 / Endorsements
          </p>
          <h2 className="xl:text-5xl md:text-4xl text-3xl font-semibold tracking-[-0.05em] leading-tight text-white">
            <span className="inline-block bg-gradient-to-r from-white via-white via-65% to-orange-400 bg-clip-text text-transparent font-semibold">
              Trusted by Startups and the world&apos;s largest companies.
            </span>
          </h2>
          <p className="mx-auto text-base text-[#A3A3A3] max-w-xl leading-relaxed">
            How visionary leaders across Asia and the UAE accelerate their growth with Miux Studio.
          </p>
        </article>

        {/* Responsive grid: all cards render together at once as a single block */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full pt-4 pb-12">
          {/* Column 1 */}
          <div className="flex flex-col gap-6 lg:gap-8 h-full">
            <div className="group flex-[7] flex flex-col justify-between relative bg-[#1A1A1A] text-white overflow-hidden rounded-2xl border border-white/[0.08] p-7 transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-1.5">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888812_1px,transparent_1px),linear-gradient(to_bottom,#88888812_1px,transparent_1px)] bg-[size:50px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
              <article className="mt-auto relative z-10">
                <p className="text-base sm:text-lg leading-relaxed text-neutral-200 font-normal">
                  &ldquo;Miux Studio has been a game-changer for our brand. Their design systems and engineering velocity are unmatched.&rdquo;
                </p>
                <div className="flex justify-between items-center pt-6 mt-5 border-t border-white/[0.08] group-hover:border-orange-500/20 transition-colors">
                  <div>
                    <h3 className="font-semibold lg:text-lg text-base text-white">
                      Guillermo Rauch
                    </h3>
                    <p className="text-xs text-[#707070]">CEO of Enigma</p>
                  </div>
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"
                    alt="Guillermo Rauch"
                    width={200}
                    height={200}
                    loading="lazy"
                    className="w-13 h-13 rounded-full object-cover border border-white/20 group-hover:border-orange-500/40 transition-colors"
                  />
                </div>
              </article>
            </div>

            {/* Accent Card with Warm Vibrant Orange Gradient */}
            <div className="group flex-[3] flex flex-col justify-between relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white overflow-hidden rounded-2xl border border-orange-400/40 p-7 transition-all duration-300 hover:border-orange-300 hover:-translate-y-1.5">
              <article className="mt-auto">
                <p className="text-base leading-relaxed text-white/95 font-normal">
                  &ldquo;We saw a 3x lift in conversion within four weeks of launching the new digital platform.&rdquo;
                </p>
                <div className="flex justify-between items-center pt-5 mt-4 border-t border-white/25">
                  <div>
                    <h3 className="font-semibold text-lg text-white">Rika Shinoda</h3>
                    <p className="text-xs text-white/80">CEO of Kintsugi</p>
                  </div>
                  <Image
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces"
                    alt="Rika Shinoda"
                    width={200}
                    height={200}
                    loading="lazy"
                    className="w-13 h-13 rounded-full object-cover border border-white/40"
                  />
                </div>
              </article>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6 lg:gap-8 h-full">
            <div className="group flex flex-col justify-between relative bg-[#1A1A1A] text-white overflow-hidden rounded-2xl border border-white/[0.08] p-7 transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-1.5">
              <article className="mt-auto">
                <p className="text-sm sm:text-base leading-relaxed text-neutral-300">
                  &ldquo;Their team is highly strategic, and their clean development architecture truly streamlined our customer journey.&rdquo;
                </p>
                <div className="flex justify-between items-center pt-5 mt-4 border-t border-white/[0.08] group-hover:border-orange-500/20 transition-colors">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-white">
                      Reacher
                    </h3>
                    <p className="text-xs text-[#707070]">CEO of OdeaoLabs</p>
                  </div>
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces"
                    alt="Reacher"
                    width={200}
                    height={200}
                    loading="lazy"
                    className="w-12 h-12 rounded-full object-cover border border-white/15 group-hover:border-orange-500/40 transition-colors"
                  />
                </div>
              </article>
            </div>

            <div className="group flex flex-col justify-between relative bg-[#1A1A1A] text-white overflow-hidden rounded-2xl border border-white/[0.08] p-7 transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-1.5">
              <article className="mt-auto">
                <p className="text-sm sm:text-base leading-relaxed text-neutral-300">
                  &ldquo;Working with Miux Studio was effortless. Senior-level partners, zero fluff, and delivery that exceeded our expectations.&rdquo;
                </p>
                <div className="flex justify-between items-center pt-5 mt-4 border-t border-white/[0.08] group-hover:border-orange-500/20 transition-colors">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-white">John</h3>
                    <p className="text-xs text-[#707070]">CEO of Labsbo</p>
                  </div>
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces"
                    alt="John"
                    width={200}
                    height={200}
                    loading="lazy"
                    className="w-12 h-12 rounded-full object-cover border border-white/15 group-hover:border-orange-500/40 transition-colors"
                  />
                </div>
              </article>
            </div>

            <div className="group flex flex-col justify-between relative bg-[#1A1A1A] text-white overflow-hidden rounded-2xl border border-white/[0.08] p-7 transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-1.5">
              <article className="mt-auto">
                <p className="text-sm sm:text-base leading-relaxed text-neutral-300">
                  &ldquo;Their creative direction elevated our positioning across the UAE. We could not have asked for a better partner.&rdquo;
                </p>
                <div className="flex justify-between items-center pt-5 mt-4 border-t border-white/[0.08] group-hover:border-orange-500/20 transition-colors">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-white">
                      Steven Sunny
                    </h3>
                    <p className="text-xs text-[#707070]">CEO of Boxefi</p>
                  </div>
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces"
                    alt="Steven Sunny"
                    width={200}
                    height={200}
                    loading="lazy"
                    className="w-12 h-12 rounded-full object-cover border border-white/15 group-hover:border-orange-500/40 transition-colors"
                  />
                </div>
              </article>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6 lg:gap-8 h-full md:col-span-2 lg:col-span-1">
            {/* Accent Card with Warm Vibrant Orange Gradient */}
            <div className="group flex-[3] flex flex-col justify-between relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white overflow-hidden rounded-2xl border border-orange-400/40 p-7 transition-all duration-300 hover:border-orange-300 hover:-translate-y-1.5">
              <article className="mt-auto">
                <p className="text-base leading-relaxed text-white/95 font-normal">
                  &ldquo;Miux Studio has been a pivotal growth driver for our enterprise web products.&rdquo;
                </p>
                <div className="flex justify-between items-center pt-5 mt-4 border-t border-white/25">
                  <div>
                    <h3 className="font-semibold text-lg text-white">Guillermo Rauch</h3>
                    <p className="text-xs text-white/80">CEO of OdeaoLabs</p>
                  </div>
                  <Image
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces"
                    alt="Guillermo Rauch"
                    width={200}
                    height={200}
                    loading="lazy"
                    className="w-13 h-13 rounded-full object-cover border border-white/40"
                  />
                </div>
              </article>
            </div>

            <div className="group flex-[7] flex flex-col justify-between relative bg-[#1A1A1A] text-white overflow-hidden rounded-2xl border border-white/[0.08] p-7 transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-1.5">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888812_1px,transparent_1px),linear-gradient(to_bottom,#88888812_1px,transparent_1px)] bg-[size:50px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
              <article className="mt-auto relative z-10">
                <p className="text-base sm:text-lg leading-relaxed text-neutral-200 font-normal">
                  &ldquo;Miux Studio has been a true partner. Their deep craftsmanship, high standards, and relentless commitment to measurable results set them completely apart.&rdquo;
                </p>
                <div className="flex justify-between items-center pt-6 mt-5 border-t border-white/[0.08] group-hover:border-orange-500/20 transition-colors">
                  <div>
                    <h3 className="font-semibold lg:text-lg text-base text-white">
                      Paul Brauch
                    </h3>
                    <p className="text-xs text-[#707070]">CTO of Spectrum</p>
                  </div>
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces"
                    alt="Paul Brauch"
                    width={200}
                    height={200}
                    loading="lazy"
                    className="w-13 h-13 rounded-full object-cover border border-white/20 group-hover:border-orange-500/40 transition-colors"
                  />
                </div>
              </article>
            </div>
          </div>
        </div>

        {/* Decorative framed line */}
        <div className="relative border-b border-white/10 mt-6 h-8 z-[2] w-full">
          <div className="w-full h-full relative before:absolute before:-left-1 before:-bottom-1 before:w-2 before:h-2 before:bg-[#202020] before:border before:border-white/20 after:absolute after:-right-1 after:-bottom-1 after:w-2 after:h-2 after:bg-[#202020] after:border after:border-white/20" />
        </div>
      </motion.div>
    </section>
  );
}

export default ClientFeedback;
export { ClientFeedback, ClientFeedback as Testimonials };
