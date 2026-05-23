"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
};

type Stat = {
  id: number;
  value: string;
  label: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

const FadeInUp = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    custom={delay}
    viewport={{ once: true, margin: "-100px" }}
  >
    {children}
  </motion.div>
);

export default function AboutPageClient({
  teamMembers,
  stats,
}: {
  teamMembers: TeamMember[];
  stats: Stat[];
}) {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <main className="bg-linear-to-br from-gray-950 via-black to-gray-900 text-white min-h-screen overflow-x-hidden relative">
      {/* Noise Texture */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] bg-[url('/noise.png')]" />

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden"
      >
        <motion.div style={{ y: yParallax }} className="absolute inset-0">
          <Image
            src="/images/backdrop.png"
            alt="About Eccentric Digital"
            fill
            priority
            sizes="100vw"
            className="object-cover scale-105"
          />
        </motion.div>

        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/60 to-black/95" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 px-4 text-center max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-0.02em] mb-6">
            We Don&apos;t Build Websites.
            <br />
            <span className="bg-linear-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
              We Build Digital Authority.
            </span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl">
            Eccentric Digital crafts cinematic, high-performance experiences
            designed to position brands as category leaders.
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="h-32 bg-gradient-to-b from-transparent to-black/80 blur-2xl" />

      {/* STORY */}
      <section className="py-24 md:py-32 max-w-5xl mx-auto px-4 text-center">
        <FadeInUp>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Our Philosophy
          </h2>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
            <p>Most websites exist. Very few <em>dominate</em>.</p>
            <p>
              We operate at the intersection of strategy, design, and
              engineering — building platforms that don&apos;t just look exceptional,
              but actively drive growth, trust, and authority.
            </p>
            <p>
              Every project is crafted with precision, built for performance,
              and engineered to give our clients an unfair competitive
              advantage.
            </p>
          </div>
        </FadeInUp>
      </section>

      {/* STATS */}
      <section className="py-24 border-y border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, i) => (
            <FadeInUp key={stat.id} delay={i * 0.1}>
              <div>
                <h3 className="text-3xl md:text-5xl font-black">
                  {stat.value}
                </h3>
                <p className="text-gray-400 text-sm mt-3 tracking-wide">
                  {stat.label}
                </p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-32 bg-gradient-to-b from-transparent to-black/80 blur-2xl" />

      {/* VALUES */}
      <section className="py-24 md:py-32 bg-linear-to-tr from-gray-950 via-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-20">
              What We Stand For
            </h2>
          </FadeInUp>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Innovation",
                desc: "We push boundaries with modern tech and cinematic design systems.",
              },
              {
                title: "Precision",
                desc: "Every pixel, animation, and interaction is intentional.",
              },
              {
                title: "Impact",
                desc: "We measure success by results — not aesthetics alone.",
              },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                className="group rounded-2xl bg-white/5 p-8 border border-white/10 hover:border-[#24eda2]/40 transition"
              >
                <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-300">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-4 text-center">
        <FadeInUp>
          <h2 className="text-3xl md:text-4xl font-bold mb-20">
            Meet the Vision
          </h2>
        </FadeInUp>

        <div className="flex flex-wrap justify-center gap-10">
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ y: -8 }}
              className="rounded-2xl bg-white/5 p-10 border border-white/10"
            >
              <Image
                src={member.imageUrl}
                alt={member.name}
                width={240}
                height={240}
                className="rounded-full mx-auto mb-6 object-cover w-48 h-48 ring-2 ring-white/10"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-400 mt-2">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-32 bg-gradient-to-b from-transparent to-black/80 blur-2xl" />

      {/* CTA */}
      <section className="py-32 text-center bg-black">
        <FadeInUp>
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Build Something That Stands Above?
          </h2>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12 text-lg">
            We partner with a limited number of brands — ensuring every project
            receives elite-level strategy, design, and execution.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/contact"
              className="px-12 py-5 rounded-xl bg-linear-to-r from-[#24eda2] to-[#00a3f8] font-bold text-lg shadow-2xl relative overflow-hidden"
            >
              <span className="relative z-10">Start Your Project →</span>

              <motion.span
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-white/10 blur-md"
              />
            </Link>
          </motion.div>
        </FadeInUp>
      </section>
    </main>
  );
}
