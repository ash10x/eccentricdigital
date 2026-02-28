"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function LandingPage() {
  const containerRef = useRef(null);

  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
  });

  const projects = [
    {
      title: "The Aroma Circle",
      description:
        "A groundbreaking e-commerce platform that redefines online shopping.",
      image: "/portfolio/the-aroma-circle.png",
    },
    {
      title: "Project Two",
      description:
        "An innovative SaaS solution that streamlines business operations.",
      image: "/portfolio/the-aroma-circle.png",
    },
    {
      title: "Project Three",
      description:
        "A cutting-edge mobile app that revolutionizes social networking.",
      image: "/portfolio/the-aroma-circle.png",
    },
  ];

  const progressScale = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const heroParallax = useTransform(scrollY, [0, 800], [0, -180]);
  const opacityFade = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const slideUp = useTransform(scrollYProgress, [0.2, 0.4], [120, 0]);

  return (
    <main ref={containerRef} className="bg-black text-white overflow-x-hidden">
      {/* ================= SCROLL PROGRESS ================= */}

      <motion.div
        style={{ scaleX: progressScale }}
        className="fixed top-0 left-0 right-0 h-1 bg-[#24eda2] origin-left z-50"
      />

      {/* ================= HERO ================= */}

      <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        {/* Animated Glow Depth */}
        <motion.div
          style={{ y: heroParallax }}
          className="absolute inset-0 bg-linear-to-br from-[#24eda2]/10 via-black to-[#00a3f8]/10 blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-5xl"
        >
          <h1 className="text-6xl md:text-6xl font-black leading-tight tracking-tight">
            Websites Shouldn’t Just Exist.
            <br />
            <span className="bg-linear-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
              They Should Dominate.
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            We design unfair digital advantages. Cinematic experiences
            engineered for conversion, authority, and long-term growth.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/contact"
              className="px-12 py-5 rounded-xl bg-linear-to-r from-[#24eda2] to-[#00a3f8] 
              font-bold text-lg hover:scale-105 transition shadow-2xl"
            >
              Start a Project →
            </Link>

            <Link
              href="#portfolio"
              className="px-12 py-5 rounded-xl border border-white/20 
              hover:bg-white/10 transition"
            >
              View Projects
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ================= PROBLEM AGITATION ================= */}

      <section className="py-40 px-6 text-center max-w-5xl mx-auto">
        <motion.div style={{ opacity: opacityFade, y: slideUp }}>
          <h2 className="text-5xl md:text-5xl font-extrabold mb-10 leading-tight">
            Most Websites Are
            <br />
            <span className="text-gray-500">Polite Digital Brochures.</span>
          </h2>

          <p className="text-gray-400 text-md leading-relaxed max-w-3xl mx-auto">
            Slow. Generic. Built to exist — not to convert.
            <br />
            <br />
            If your website isn’t positioning you as the obvious category
            leader, it’s quietly leaking revenue.
          </p>
        </motion.div>
      </section>

      {/* ================= DIFFERENTIATION ================= */}

      <section className="py-40 bg-linear-to-b from-black to-neutral-900 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-14">
          {[
            {
              title: "Cinematic Design",
              desc: "Visual storytelling engineered to command attention and hold it.",
            },
            {
              title: "Conversion Architecture",
              desc: "Strategic funnels embedded directly into the design layer.",
            },
            {
              title: "Future-Ready Tech",
              desc: "Blazing performance, scalability, and technical precision.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="rounded-3xl bg-white/5 border border-white/10 p-12 
              backdrop-blur-2xl transition-all duration-500
              hover:border-[#24eda2]/40 hover:-translate-y-4
              hover:shadow-[0_0_60px_rgba(36,237,162,0.15)]"
            >
              <h3 className="text-2xl font-bold mb-6">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= PORTFOLIO ================= */}

      <section id="portfolio" className="py-40 px-6 bg-black">
        <h2 className="text-5xl font-extrabold text-center mb-24">
          Selected Work
        </h2>

        <div className="max-w-6xl mx-auto space-y-28">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 120 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative overflow-hidden rounded-3xl 
                border border-white/10 shadow-2xl"
            >
              <div
                className="h-130 bg-linear-to-br from-gray-900 to-black 
                flex items-center justify-center text-4xl font-black tracking-wide"
              >
                <Image
                  src={project.image}
                  fill
                  alt={project.title}
                  className="object-cover w-full h-full group-hover:scale-110 transition duration-500"
                />
              </div>

              <div
                className="absolute inset-0 bg-black/80 opacity-0 
                group-hover:opacity-100 transition flex items-center justify-center"
              >
                <Link
                  href="/contact"
                  className="px-10 py-4 bg-linear-to-r 
                    from-[#24eda2] to-[#00a3f8] rounded-xl font-bold"
                >
                  Visit Website →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= AUTHORITY STRIP ================= */}

      <section className="py-24 bg-linear-to-r from-[#24eda2]/10 to-[#00a3f8]/10 text-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-4xl font-black">
          <div>+120% Avg. Conversion Lift</div>
          <div>98% Client Retention</div>
          <div>Sub-1.2s Load Speeds</div>
        </div>
      </section>

      {/* ================= FINAL CLOSE ================= */}

      <section className="py-44 text-center bg-black">
        <h2 className="text-5xl md:text-5xl font-black mb-10 leading-tight">
          If You’re Ready to Lead —
          <br />
          Build the Platform That Proves It.
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto mb-14 text-md">
          We take on a limited number of projects each quarter. If you’re
          serious about growth, this is your move.
        </p>

        <Link
          href="/contact"
          className="px-14 py-6 rounded-xl bg-linear-to-r 
          from-[#24eda2] to-[#00a3f8] font-bold text-xl 
          hover:scale-105 transition shadow-2xl"
        >
          Apply to Work With Us →
        </Link>
      </section>
    </main>
  );
}
