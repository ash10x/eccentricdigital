"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

/* ---------------- Animation Variants ---------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

/* ---------------- Reusable Wrapper ---------------- */

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

export default function AboutPage() {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <main className="bg-linear-to-br from-gray-950 via-black to-gray-900 text-white min-h-screen overflow-hidden">
      {/* ================= HERO ================= */}
      <section
        ref={heroRef}
        className="relative h-[60vh] md:h-[70vh] flex items-center justify-center"
      >
        <motion.div style={{ y: yParallax }} className="absolute inset-0">
          <Image
            src="/images/backdrop.png"
            alt="About Eccentric Digital"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* Premium Depth Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/60 to-black/95 backdrop-blur-[2px]" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 px-4 text-center max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            About Us
          </h1>
          <p className="text-gray-300 text-md md:text-xl">
            We craft cinematic digital experiences that elevate brands, drive
            performance, and transform perception.
          </p>
        </motion.div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="py-24 md:py-32 max-w-5xl mx-auto px-4 md:px-6 text-center">
        <FadeInUp>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Our Story</h2>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div className="space-y-6 text-gray-300 text-base md:text-md leading-relaxed max-w-3xl mx-auto">
            <p>
              Every brand deserves a digital presence as bold as its ambition.
            </p>
            <p>
              By blending strategy, immersive design, and modern development, we
              build platforms that look exceptional and perform flawlessly.
            </p>
            <p>
              From full website transformations to custom builds and long-term
              maintenance, our mission is simple — create digital experiences
              that grow with you.
            </p>
          </div>
        </FadeInUp>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-20 border-y border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { number: "50+", label: "Projects Delivered" },
            { number: "5+", label: "Years Experience" },
            { number: "98%", label: "Client Satisfaction" },
            { number: "24/7", label: "Support & Maintenance" },
          ].map((stat, i) => (
            <FadeInUp key={i} delay={i * 0.1}>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold">
                  {stat.number}
                </h3>
                <p className="text-gray-400 text-sm mt-3 tracking-wide">
                  {stat.label}
                </p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="py-24 md:py-32 bg-linear-to-tr from-gray-950 via-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <FadeInUp>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-20">
              Our Values
            </h2>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Innovation",
                desc: "Modern frameworks, cinematic motion, and forward-thinking design that keep brands ahead.",
              },
              {
                title: "Reliability",
                desc: "Performance, security, and long-term stability built into every project.",
              },
              {
                title: "Transformation",
                desc: "Turning outdated platforms into immersive digital experiences that drive real results.",
              },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative rounded-2xl bg-linear-to-br from-white/5 to-white/2 p-8 border border-white/10 hover:border-[#24eda2]/40 transition-all duration-300 shadow-xl"
              >
                <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-[#24eda2] to-[#00a3f8] opacity-0 group-hover:opacity-100 transition" />
                <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-300">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-4 md:px-6 text-center">
        <FadeInUp>
          <h2 className="text-3xl md:text-4xl font-bold mb-20">
            Meet the Team
          </h2>
        </FadeInUp>

        <div className="grid place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            {
              name: "Rodique",
              role: "Founder / Creative Director",
              image: "/team/creativedirector.jpeg",
            },
            // {
            //   name: "Sophia",
            //   role: "Lead Designer",
            //   image: "/images/team-sophia.jpg",
            // },
            // {
            //   name: "David",
            //   role: "Frontend Engineer",
            //   image: "/images/team-david.jpg",
            // },
          ].map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl bg-linear-to-br from-white/5 to-white/2 p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <Image
                src={member.image}
                alt={member.role}
                width={220}
                height={220}
                className="rounded-full mx-auto mb-6 object-cover w-40 h-40 md:w-56 md:h-56 ring-2 ring-white/10 group-hover:ring-[#24eda2]/40 transition"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-400 mt-2">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-28 bg-linear-to-b from-black via-gray-900 to-black text-center">
        <FadeInUp>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            Ready to Build Something Exceptional?
          </h2>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12 text-lg">
            Let’s transform your vision into a high-performing, cinematic
            digital experience.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-linear-to-r from-[#24eda2] to-[#00a3f8] text-white font-semibold shadow-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(36,237,162,0.35)] transition-all duration-300"
          >
            Start Your Project
          </a>
        </FadeInUp>
      </section>
    </main>
  );
}
