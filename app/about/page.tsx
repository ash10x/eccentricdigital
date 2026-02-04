"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

/* ---------------- Reusable Fade Wrapper ---------------- */
const FadeInUp = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

export default function AboutPage() {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, -120]);

  return (
    <main className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white min-h-screen overflow-hidden">
      {/* ---------------- HERO ---------------- */}
      <section
        ref={ref}
        className="relative h-[55vh] md:h-[65vh] flex items-center justify-center"
      >
        <motion.div style={{ y: yParallax }} className="absolute inset-0">
          <Image
            src="/images/backdrop.png"
            alt="About Us"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        {/* Depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 px-4 text-center max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-[0_0_20px_rgba(36,237,162,0.35)]">
            About Us
          </h1>
          <p className="text-gray-300 text-base md:text-lg">
            We don’t just build websites — we craft immersive digital
            experiences that elevate brands and tell unforgettable stories.
          </p>
        </motion.div>
      </section>

      {/* ---------------- OUR STORY ---------------- */}
      <section className="py-20 md:py-28 max-w-5xl mx-auto px-4 md:px-6 text-center">
        <FadeInUp>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Story</h2>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Founded on the belief that every brand deserves a digital presence
            as bold as its vision, we blend strategy, design, and technology to
            create cinematic web experiences. From custom web design and website
            remodeling to reliable maintenance and quick-start launches, our
            mission has always been simple: build digital platforms that look
            incredible, perform flawlessly, and grow with you.
          </p>
        </FadeInUp>
      </section>

      {/* ---------------- VALUES ---------------- */}
      <section className="py-20 md:py-28 bg-gradient-to-tr from-gray-900 via-black to-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <FadeInUp>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Our Values
            </h2>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Innovation",
                desc: "We embrace modern frameworks, cinematic motion, and forward-thinking design to keep brands ahead of the curve.",
              },
              {
                title: "Reliability",
                desc: "Performance, security, and stability come first — with proactive maintenance and real-world reliability.",
              },
              {
                title: "Transformation",
                desc: "We turn outdated sites into modern, immersive platforms that drive attention and results.",
              },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="rounded-2xl bg-white/10 backdrop-blur-xl p-8 border border-white/10 shadow-xl"
              >
                <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-300">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- TEAM ---------------- */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-6 text-center">
        <FadeInUp>
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            Meet the Team
          </h2>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              name: "Rodique",
              role: "Creative Director",
              image: "/images/team-rodique.jpg",
            },
            {
              name: "Sophia",
              role: "Lead Designer",
              image: "/images/team-sophia.jpg",
            },
            {
              name: "David",
              role: "Frontend Engineer",
              image: "/images/team-david.jpg",
            },
          ].map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl bg-white/10 backdrop-blur-xl p-8 border border-white/10 shadow-xl"
            >
              <Image
                src={member.image}
                alt={member.name}
                width={220}
                height={220}
                className="rounded-full mx-auto mb-6 object-cover w-40 h-40 md:w-56 md:h-56"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-400">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900 text-center">
        <FadeInUp>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            Ready to Build Something Exceptional?
          </h2>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <p className="text-gray-300 max-w-2xl mx-auto mb-10">
            Let’s transform your vision into a cinematic digital experience that
            performs as beautifully as it looks.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <a
            href="/contact"
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            Start Your Project
          </a>
        </FadeInUp>
      </section>
    </main>
  );
}
