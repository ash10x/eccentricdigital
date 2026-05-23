"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

type Service = {
  id: number;
  title: string;
  tags: string[];
  description: string;
  imageUrl: string;
  route: string;
};

type Stat = { id: number; value: string; label: string };

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
    >
      <Link href={service.route} className="block group">
        <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 bg-white/[0.02]">
          {/* Image */}
          <div className="relative h-64 overflow-hidden">
            <Image
              src={service.imageUrl}
              alt={service.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full border border-white/[0.07] bg-white/[0.03] text-[10px] uppercase tracking-[2px] text-white/30 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="text-[22px] font-bold tracking-[-0.03em] mb-3 group-hover:text-[#24eda2] transition-colors duration-300">
              {service.title}
            </h3>

            <p className="text-white/40 text-[14px] leading-relaxed mb-6">
              {service.description}
            </p>

            <span className="inline-flex items-center gap-2 text-[13px] text-white/25 group-hover:text-[#24eda2] transition-colors duration-300 font-medium">
              Explore Service
              <span className="translate-x-0 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ServicesPageClient({
  services,
  stats,
}: {
  services: Service[];
  stats: Stat[];
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressScale = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <main ref={containerRef} className="bg-[#060606] text-white overflow-x-hidden relative">
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progressScale }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#24eda2] to-[#00a3f8] origin-left z-50"
      />

      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] flex items-center justify-center text-center px-6 overflow-hidden pt-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#24eda2]/[0.05] blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#00a3f8]/[0.04] blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#24eda2] animate-pulse" />
            <span className="text-[11px] uppercase tracking-[3px] text-white/50 font-semibold">
              What We Offer
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[52px] md:text-[76px] lg:text-[88px] font-black leading-[0.92] tracking-[-0.04em] mb-8"
          >
            We Don&apos;t Offer
            <br />
            Services.
            <br />
            <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
              We Build Weapons.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-[17px] text-white/40 max-w-xl mx-auto leading-relaxed tracking-[-0.01em]"
          >
            Every engagement is engineered for authority, performance,
            and consistent conversion.
          </motion.p>
        </div>
      </section>

      {/* ── PROBLEM STATEMENT ── */}
      <section className="py-32 px-6 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-8">
            The Problem
          </p>
          <h2 className="text-[44px] md:text-[60px] font-black leading-[0.95] tracking-[-0.04em] mb-10">
            Most Websites Are
            <br />
            <span className="text-white/20">Digital Decorations.</span>
          </h2>
          <p className="text-white/35 text-[17px] leading-relaxed max-w-2xl mx-auto tracking-[-0.01em]">
            They look decent. They function. But they don&apos;t position you,
            don&apos;t convert consistently, and don&apos;t scale with ambition.
          </p>
        </motion.div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-4">
              Our Services
            </p>
            <h2 className="text-[44px] md:text-[52px] font-black tracking-[-0.04em] leading-none">
              What We Do
            </h2>
          </div>
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white border border-white/[0.08] hover:border-white/20 px-5 py-2.5 rounded-lg transition-all"
          >
            Start a Project →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-6 border-y border-white/[0.06] mt-16">
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
              Serious About Growth
            </p>
            <h2 className="text-[52px] md:text-[68px] font-black leading-[0.9] tracking-[-0.04em] mb-8">
              Let&apos;s Build the Platform
              <br />
              <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
                That Proves It.
              </span>
            </h2>
            <p className="text-white/35 text-[16px] max-w-lg mx-auto mb-12 leading-relaxed tracking-[-0.01em]">
              We take on a limited number of high-impact projects each quarter.
              Spots are earned, not given.
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
