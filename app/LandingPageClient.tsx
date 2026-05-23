"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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

export default function LandingPageClient({
  projects,
  stats,
}: {
  projects: Project[];
  stats: Stat[];
}) {
  const containerRef = useRef(null);

  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
  });

  const progressScale = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const heroParallax = useTransform(scrollY, [0, 800], [0, -180]);
  const opacityFade = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const slideUp = useTransform(scrollYProgress, [0.2, 0.4], [120, 0]);

  return (
    <main
      ref={containerRef}
      className="bg-black text-white overflow-x-hidden relative"
    >
      {/* GLOBAL NOISE */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.025] bg-[url('/images/backdrop.png')]" />

      {/* SCROLL PROGRESS */}
      <motion.div
        style={{ scaleX: progressScale }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#24eda2] to-[#00a3f8] origin-left z-50"
      />

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        <motion.div
          style={{ y: heroParallax }}
          className="absolute inset-0 bg-gradient-to-br from-[#24eda2]/10 via-black to-[#00a3f8]/10 blur-3xl"
        />

        <div className="relative z-10 max-w-5xl">
          <h1 className="text-6xl font-black leading-[1.05] tracking-tight">
            Websites Shouldn&apos;t Just Exist.
            <br />
            <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
              They Should Dominate.
            </span>
          </h1>

          <p className="mt-8 text-lg text-gray-300 max-w-2xl mx-auto">
            We design unfair digital advantages — cinematic experiences built
            for conversion, authority, and long-term growth.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 justify-center">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href="/contact"
                className="px-12 py-5 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] font-bold text-lg shadow-xl relative overflow-hidden"
              >
                Start a Project →
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href="#portfolio"
                className="px-12 py-5 rounded-xl border border-white/20 hover:bg-white/10 transition"
              >
                View Portfolio
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRANSITION */}
      <div className="h-32 bg-linear-to-b from-transparent via-neutral-900/60 to-transparent blur-2xl" />

      {/* PROBLEM */}
      <section className="py-36 px-6 text-center max-w-5xl mx-auto">
        <motion.div style={{ opacity: opacityFade, y: slideUp }}>
          <h2 className="text-5xl font-extrabold mb-10 tracking-tight">
            Most Websites Are{" "}
            <span className="text-gray-500">Polite Brochures.</span>
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            They look fine — but they don&apos;t convert.
            <br />
            <br />
            No urgency. No authority. No positioning.
            <br />
            <br />
            Which means your competitors win by default.
          </p>
        </motion.div>
      </section>

      {/* DIFFERENTIATION */}
      <section className="py-40 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Cinematic Design",
              desc: "Engineered to command attention instantly.",
            },
            {
              title: "Conversion Systems",
              desc: "Built to turn visitors into paying clients.",
            },
            {
              title: "Performance Tech",
              desc: "Speed, scale, and precision at every level.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="rounded-3xl bg-white/5 border border-white/10 p-10 backdrop-blur-xl hover:border-[#24eda2]/40 hover:-translate-y-3 transition"
            >
              <h3 className="text-xl font-bold mb-4 text-[#24eda2]">
                {item.title}
              </h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="py-40 px-6">
        <h2 className="text-5xl text-center font-extrabold mb-10 tracking-tight">
          Selected Work
        </h2>

        <div className="max-w-6xl mx-auto space-y-24">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 120 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl overflow-hidden border border-white/10"
            >
              <Image
                src={project.imageUrl}
                width={1200}
                height={700}
                alt={project.title}
                className="w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center">
                <p className="text-xl font-bold mb-6">{project.title}</p>
                <Link
                  href={project.siteUrl}
                  target="_blank"
                  className="px-8 py-3 bg-gradient-to-r from-[#24eda2] to-[#00a3f8] rounded-lg font-semibold"
                >
                  View Project →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl border border-white/20 hover:border-[#24eda2]/50 hover:bg-white/5 font-semibold transition duration-300"
          >
            View All Projects →
          </Link>
        </motion.div>
      </section>

      {/* AUTHORITY */}
      <section className="py-24 text-center bg-gradient-to-r from-[#24eda2]/10 to-[#00a3f8]/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {stats.map((stat) => (
            <div key={stat.id}>
              <h3 className="text-4xl font-bold text-[#24eda2]">{stat.value}</h3>
              <p className="text-gray-400 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 text-center px-6">
        <h2 className="text-5xl font-black mb-8">
          Ready to Outperform Your Competition?
        </h2>

        <p className="text-gray-400 max-w-xl mx-auto mb-12">
          We partner with a limited number of brands each quarter.
        </p>

        <Link
          href="/contact"
          className="px-14 py-6 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] font-bold text-xl shadow-xl hover:scale-105 transition"
        >
          Apply to Work With Us →
        </Link>
      </section>
    </main>
  );
}
