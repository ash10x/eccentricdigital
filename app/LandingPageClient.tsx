"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type Project = { id: number; title: string; imageUrl: string; siteUrl: string };
type Stat = { id: number; value: string; label: string };

const marqueeItems = [
  "Custom Web Design",
  "Website Remodeling",
  "E-commerce Development",
  "SEO Optimization",
  "Brand Strategy",
  "Website Maintenance",
  "Conversion Design",
  "Performance Engineering",
];

const differentiators = [
  {
    number: "01",
    title: "Cinematic Design",
    desc: "Engineered to command attention from the first scroll. Every element is intentional.",
  },
  {
    number: "02",
    title: "Conversion Systems",
    desc: "Built around psychology and data. Visitors become clients.",
  },
  {
    number: "03",
    title: "Performance Tech",
    desc: "Sub-second load times. Rock-solid infrastructure. Zero compromise.",
  },
];

export default function LandingPageClient({
  projects,
  stats,
}: {
  projects: Project[];
  stats: Stat[];
}) {
  const containerRef = useRef(null);
  const { scrollYProgress, scrollY } = useScroll({ target: containerRef });

  const progressScale = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });
  const heroParallax = useTransform(scrollY, [0, 900], [0, -200]);
  const opacityFade = useTransform(scrollYProgress, [0.08, 0.22], [0, 1]);
  const slideUp = useTransform(scrollYProgress, [0.08, 0.22], [80, 0]);

  return (
    <main
      ref={containerRef}
      className="bg-[#060606] text-white overflow-x-hidden relative"
    >
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progressScale }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#24eda2] to-[#00a3f8] origin-left z-50"
      />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        {/* Background blobs */}
        <motion.div
          style={{ y: heroParallax }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#24eda2]/[0.06] blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-[#00a3f8]/[0.05] blur-[100px]" />
        </motion.div>

        {/* Noise */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.018] bg-[url('/images/backdrop.png')] bg-cover" />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/4 border border-white/[0.08] mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#24eda2] animate-pulse mt-1.5" />
            <span className="text-[11px] uppercase tracking-[3px] text-white/50 font-semibold">
              Premium Digital Studio
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[56px] md:text-[80px] lg:text-[96px] font-black leading-[0.92] tracking-[-0.04em] mb-8"
          >
            Websites
            <br />
            <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
              Shouldn&apos;t
            </span>
            <br />
            Just Exist.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-[17px] text-white/40 max-w-xl mx-auto leading-relaxed mb-12 tracking-[-0.01em]"
          >
            We design unfair digital advantages — cinematic experiences
            engineered for conversion, authority, and long-term dominance.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center"
          >
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black font-bold text-[15px] tracking-[-0.01em] hover:shadow-[0_20px_60px_rgba(36,237,162,0.3)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Start a Project
            </Link>
            <Link
              href="#portfolio"
              className="px-8 py-4 rounded-xl border border-white/[0.1] text-white/70 font-semibold text-[15px] tracking-[-0.01em] hover:border-white/20 hover:text-white transition-all duration-300"
            >
              View Portfolio ↓
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-[1px] h-8 bg-gradient-to-b from-transparent to-white/20"
          />
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y border-white/[0.05] py-5 overflow-hidden bg-[#060606]">
        <div className="flex w-max marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-4 px-6 text-[11px] uppercase tracking-[3px] text-white/25 whitespace-nowrap font-medium"
            >
              {item}
              <span className="text-[#24eda2]/50 text-[8px]">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── PROBLEM ── */}
      <section className="py-40 px-6 max-w-5xl mx-auto text-center">
        <motion.div style={{ opacity: opacityFade, y: slideUp }}>
          <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-8">
            The Problem
          </p>
          <h2 className="text-[44px] md:text-[60px] font-black leading-[0.95] tracking-[-0.04em] mb-10">
            Most Websites Are <br />
            <span className="text-white/20">Polite Brochures.</span>
          </h2>
          <p className="text-white/35 text-[17px] leading-relaxed max-w-2xl mx-auto tracking-[-0.01em]">
            They look fine. They function. But they don&apos;t convert,
            don&apos;t position, and don&apos;t scale with ambition. Your
            competitors win by default.
          </p>
        </motion.div>
      </section>

      {/* ── DIFFERENTIATION ── */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-16 items-start">
          {/* Left label */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-6">
                Our Approach
              </p>
              <h2 className="text-[40px] md:text-[52px] font-black leading-[0.95] tracking-[-0.04em]">
                Built
                <br />
                Differently.
                <br />
                <span className="text-white/20">On Purpose.</span>
              </h2>
            </motion.div>
          </div>

          {/* Right list */}
          <div className="md:col-span-3 space-y-0 divide-y divide-white/[0.06]">
            {differentiators.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="flex gap-8 py-8 group hover:bg-white/[0.01] transition-colors rounded-2xl px-4 -mx-4"
              >
                <span className="text-[11px] text-white/20 font-semibold tracking-widest pt-1 shrink-0">
                  {item.number}
                </span>
                <div>
                  <h3 className="text-[20px] font-bold tracking-[-0.02em] mb-2 group-hover:text-[#24eda2] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/40 text-[14px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section id="portfolio" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-4">
                Selected Work
              </p>
              <h2 className="text-[44px] md:text-[56px] font-black tracking-[-0.04em] leading-none">
                Recent Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden md:inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white border border-white/[0.08] hover:border-white/20 px-5 py-2.5 rounded-lg transition-all"
            >
              All Projects →
            </Link>
          </div>

          <div className="space-y-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="group relative rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500"
              >
                <div className="aspect-[16/7] relative">
                  <Image
                    src={project.imageUrl}
                    fill
                    alt={project.title}
                    sizes="(min-width: 1280px) 1200px, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </div>

                {/* Bottom info bar */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-8">
                  <div>
                    <p className="text-[11px] uppercase tracking-[3px] text-white/30 mb-1">
                      Project
                    </p>
                    <h3 className="text-[22px] font-bold tracking-[-0.02em]">
                      {project.title}
                    </h3>
                  </div>
                  <Link
                    href={project.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 px-6 py-3 rounded-xl bg-white text-black text-[13px] font-bold hover:bg-[#24eda2] transition-colors"
                  >
                    View Live →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile "View All" */}
          <div className="mt-10 text-center md:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white border border-white/[0.08] hover:border-white/20 px-6 py-3 rounded-xl transition-all"
            >
              View All Projects →
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-6 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="px-10 py-14 flex flex-col items-center text-center"
            >
              <span className="text-[72px] md:text-[88px] font-black tracking-[-0.05em] leading-none bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-[11px] uppercase tracking-[3px] text-white/25 font-semibold mt-4">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-48 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#24eda2]/[0.04] blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-8">
              Ready to Dominate
            </p>
            <h2 className="text-[52px] md:text-[72px] font-black leading-[0.9] tracking-[-0.04em] mb-8">
              Let&apos;s Build Something
              <br />
              <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
                Unfair.
              </span>
            </h2>
            <p className="text-white/35 text-[16px] max-w-lg mx-auto mb-12 leading-relaxed tracking-[-0.01em]">
              We partner with a limited number of brands each quarter. Spots are
              earned, not given.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black font-bold text-[16px] tracking-[-0.02em] hover:shadow-[0_24px_80px_rgba(36,237,162,0.35)] hover:-translate-y-1 transition-all duration-300"
            >
              Apply to Work With Us →
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
