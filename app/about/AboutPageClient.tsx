"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type TeamMember = { id: number; name: string; role: string; imageUrl: string };
type Stat = { id: number; value: string; label: string };

const values = [
  {
    number: "01",
    title: "Innovation",
    desc: "We push boundaries with modern tech and cinematic design systems built for the next decade.",
  },
  {
    number: "02",
    title: "Precision",
    desc: "Every pixel, animation, and interaction is intentional. Nothing ships without purpose.",
  },
  {
    number: "03",
    title: "Impact",
    desc: "We measure success by results — authority, conversion, and long-term market dominance.",
  },
];

export default function AboutPageClient({
  teamMembers,
  stats,
}: {
  teamMembers: TeamMember[];
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
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#00a3f8]/[0.04] blur-[100px]" />
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
              Our Story
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[52px] md:text-[76px] lg:text-[88px] font-black leading-[0.92] tracking-[-0.04em] mb-8"
          >
            We Don&apos;t Build
            <br />
            Websites.
            <br />
            <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
              We Build Authority.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-[17px] text-white/40 max-w-xl mx-auto leading-relaxed tracking-[-0.01em]"
          >
            Eccentric Digital crafts cinematic, high-performance experiences
            engineered to position brands as category leaders.
          </motion.p>
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="py-40 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-5 gap-16 items-start">
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-6">
                Our Philosophy
              </p>
              <h2 className="text-[40px] md:text-[48px] font-black leading-[0.95] tracking-[-0.04em]">
                Built to
                <br />
                Dominate.
                <br />
                <span className="text-white/20">Not Decorate.</span>
              </h2>
            </motion.div>
          </div>

          <div className="md:col-span-3 space-y-8">
            {[
              "Most websites exist. Very few dominate.",
              "We operate at the intersection of strategy, design, and engineering — building platforms that don't just look exceptional, but actively drive growth, trust, and authority.",
              "Every project is crafted with precision, built for performance, and engineered to give our clients an unfair competitive advantage.",
            ].map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className={`text-[17px] leading-relaxed tracking-[-0.01em] ${
                  i === 0 ? "text-white font-semibold text-[22px]" : "text-white/40"
                }`}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-6 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="px-8 py-14 flex flex-col items-center text-center"
            >
              <span className="text-[60px] md:text-[72px] font-black tracking-[-0.05em] leading-none bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-[11px] uppercase tracking-[3px] text-white/25 font-semibold mt-4">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-16 items-start">
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-6">
                What We Stand For
              </p>
              <h2 className="text-[40px] md:text-[48px] font-black leading-[0.95] tracking-[-0.04em]">
                Principles
                <br />
                That Drive
                <br />
                <span className="text-white/20">Every Decision.</span>
              </h2>
            </motion.div>
          </div>

          <div className="md:col-span-3 space-y-0 divide-y divide-white/[0.06]">
            {values.map((item, i) => (
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
                  <p className="text-white/40 text-[14px] leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      {teamMembers.length > 0 && (
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-4">
                  The Team
                </p>
                <h2 className="text-[44px] md:text-[52px] font-black tracking-[-0.04em] leading-none">
                  Meet the Vision
                </h2>
              </motion.div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.12] transition-all duration-500"
                >
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-5 ring-1 ring-white/[0.08]">
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-[16px] font-bold tracking-[-0.02em] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[13px] text-white/35">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

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
              Ready to Begin
            </p>
            <h2 className="text-[52px] md:text-[72px] font-black leading-[0.9] tracking-[-0.04em] mb-8">
              Ready to Build
              <br />
              <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
                Something That Lasts?
              </span>
            </h2>
            <p className="text-white/35 text-[16px] max-w-lg mx-auto mb-12 leading-relaxed tracking-[-0.01em]">
              We partner with a limited number of brands — ensuring every project
              receives elite-level strategy, design, and execution.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black font-bold text-[16px] tracking-[-0.02em] hover:shadow-[0_24px_80px_rgba(36,237,162,0.35)] hover:-translate-y-1 transition-all duration-300"
            >
              Start Your Project →
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
