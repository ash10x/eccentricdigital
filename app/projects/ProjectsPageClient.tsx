"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type Project = { id: number; title: string; imageUrl: string; siteUrl: string };
type Stat = { id: number; value: string; label: string };

function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
      className={`group relative rounded-2xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 ${
        featured ? "aspect-[16/7]" : "aspect-video"
      }`}
    >
      <Image
        src={project.imageUrl}
        alt={project.title}
        fill
        sizes={featured ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-7">
        <div>
          <p className="text-[10px] uppercase tracking-[3px] text-white/30 mb-1">Project</p>
          <h3 className="text-[18px] md:text-[22px] font-bold tracking-[-0.02em]">{project.title}</h3>
        </div>
        <Link
          href={project.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 px-5 py-2.5 rounded-xl bg-white text-black text-[13px] font-bold hover:bg-[#24eda2] transition-colors"
        >
          View Live →
        </Link>
      </div>
    </motion.div>
  );
}

export default function ProjectsPageClient({
  projects,
  stats,
}: {
  projects: Project[];
  stats: Stat[];
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressScale = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const [featured, ...rest] = projects;

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
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full bg-[#00a3f8]/[0.04] blur-[100px]" />
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
              Selected Work
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[52px] md:text-[76px] lg:text-[88px] font-black leading-[0.92] tracking-[-0.04em] mb-8"
          >
            Every Project
            <br />
            Is a
            <br />
            <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
              Statement.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-[17px] text-white/40 max-w-lg mx-auto leading-relaxed tracking-[-0.01em]"
          >
            Real brands. Real results. Built to dominate.
          </motion.p>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        {projects.length === 0 ? (
          <div className="text-center text-white/20 py-24 text-[15px]">
            No projects yet. Seed the database to get started.
          </div>
        ) : (
          <div className="space-y-6">
            {featured && <ProjectCard project={featured} index={0} featured />}
            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {rest.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i + 1} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── STATS ── */}
      {stats.length > 0 && (
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
              Join the Portfolio
            </p>
            <h2 className="text-[52px] md:text-[72px] font-black leading-[0.9] tracking-[-0.04em] mb-8">
              Want Your Brand
              <br />
              <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
                In This Portfolio?
              </span>
            </h2>
            <p className="text-white/35 text-[16px] max-w-lg mx-auto mb-12 leading-relaxed tracking-[-0.01em]">
              We partner with a limited number of brands each quarter.
              Apply before spots close.
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
