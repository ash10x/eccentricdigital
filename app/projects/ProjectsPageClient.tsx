"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type Project = {
  id: number;
  title: string;
  imageUrl: string;
  siteUrl: string;
};

type Stat = {
  id: number;
  value: string;
  label: string;
};

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
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]
        hover:border-[#24eda2]/30 transition-all duration-500
        ${featured ? "aspect-[16/7]" : "aspect-video"}`}
    >
      <Image
        src={project.imageUrl}
        alt={project.title}
        fill
        sizes={featured ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />

      {/* Permanent subtle gradient at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center justify-center gap-6">
        <motion.p
          initial={false}
          className="text-2xl font-bold tracking-tight px-6 text-center"
        >
          {project.title}
        </motion.p>
        <Link
          href={project.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black font-bold text-sm hover:scale-105 transition"
          onClick={(e) => e.stopPropagation()}
        >
          View Live Site →
        </Link>
      </div>

      {/* Bottom persistent label */}
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-0 transition-all duration-300">
        <p className="text-sm font-semibold text-white/80">{project.title}</p>
      </div>

      {/* Persistent corner label (non-hover) */}
      <div className="absolute bottom-5 left-6 group-hover:opacity-0 transition-opacity duration-300">
        <span className="text-sm font-semibold text-white/70">
          {project.title}
        </span>
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
  const heroRef = useRef(null);

  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroParallax = useTransform(heroProgress, [0, 1], [0, -160]);

  const [featured, ...rest] = projects;

  return (
    <main className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#24eda2] to-[#00a3f8] origin-left z-50"
      />

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative h-[65vh] flex items-center justify-center text-center px-6 overflow-hidden"
      >
        <motion.div style={{ y: heroParallax }} className="absolute inset-0">
          <Image
            src="/images/backdrop.png"
            alt="Portfolio"
            fill
            priority
            className="object-cover opacity-40"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 max-w-4xl"
        >
          <p className="text-xs uppercase tracking-[4px] text-[#24eda2] mb-6 font-semibold">
            Portfolio
          </p>
          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight mb-6">
            Every Project
            <br />
            <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
              Is a Statement.
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Real brands. Real results. Built to dominate.
          </p>
        </motion.div>
      </section>

      {/* ── PROJECTS GRID ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        {projects.length === 0 ? (
          <div className="text-center text-gray-500 py-24">
            No projects found. Seed the database to get started.
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured first project — full width */}
            {featured && (
              <ProjectCard project={featured} index={0} featured />
            )}

            {/* Remaining projects — 2-column grid */}
            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8">
                {rest.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i + 1} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── STATS STRIP ── */}
      {stats.length > 0 && (
        <section className="py-24 bg-gradient-to-r from-[#24eda2]/10 to-[#00a3f8]/10 text-center">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <h3 className="text-4xl font-bold text-[#24eda2]">
                  {stat.value}
                </h3>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-40 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-black mb-6 tracking-tight">
            Want Your Brand
            <br />
            <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
              In This Portfolio?
            </span>
          </h2>

          <p className="text-gray-400 max-w-xl mx-auto mb-12 text-lg">
            We partner with a limited number of brands each quarter.
            Apply before spots close.
          </p>

          <Link
            href="/contact"
            className="inline-block px-14 py-6 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] font-bold text-xl shadow-xl hover:scale-105 transition"
          >
            Start Your Project →
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
