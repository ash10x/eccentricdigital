"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    title: "Custom Website Design",
    subtitle: "Cinematic, glassmorphic, and modern designs for premium brands.",
    image: "/images/slide1.jpg",
  },
  {
    title: "Website Maintenance",
    subtitle: "Reliable updates that keep your site flawless and fast.",
    image: "/images/slide2.jpg",
  },
  {
    title: "Website Remodeling",
    subtitle: "Transform outdated websites into modern digital experiences.",
    image: "/images/slide3.jpg",
  },
  {
    title: "Quick Start Websites",
    subtitle: "Launch fast with sleek, conversion-ready websites.",
    image: "/images/slide4.jpg",
  },
];

const testimonials = [
  {
    name: "Sophia M.",
    quote:
      "They transformed our brand presence with a cinematic website that truly resonates.",
  },
  {
    name: "David L.",
    quote:
      "The glassmorphic design elevated our corporate identity — unforgettable.",
  },
  {
    name: "Aisha K.",
    quote:
      "The immersive UI/UX dramatically boosted engagement across our platforms.",
  },
];

const portfolio = [
  {
    title: "The Aroma Circle",
    description: "Cinematic, modern, conversion-focused.",
    image: "/portfolio/the-aroma-circle.jpg",
    link: "https://thearomacircle.com",
  },
  {
    title: "All Hopes For The Glory",
    description: "Sleek, futuristic design for a cutting-edge tech brand.",
    image: "/portfolio/allhopesfortheglory.jpg",
    link: "https://technova.com",
  },
  {
    title: "The Wool Lab",
    description: "Elegant, minimalist design for a high-end lifestyle brand.",
    image: "/eccentriclogo.png",
    link: "https://luxeliving.com",
  },
  {
    title: "Trans1",
    description: "Vibrant, dynamic design for a trendy restaurant chain.",
    image: "/eccentriclogo.png",
    link: "https://urbaneats.com",
  },
  {
    title: "FitPro",
    description: "Energetic, modern design for a fitness and wellness brand.",
    image: "/eccentriclogo.png",
    link: "https://fitpro.com",
  },
];

export default function LandingPage() {
  const [index, setIndex] = useState(0);
  const [manual, setManual] = useState(false);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const next = () => {
    setManual(true);
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setManual(true);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goTo = (i: number) => {
    setManual(true);
    setIndex(i);
  };

  useEffect(() => {
    if (manual) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [manual]);

  return (
    <main className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <motion.div style={{ y: yParallax }} className="absolute inset-0">
              <Image
                src={slides[index].image}
                alt={slides[index].title}
                fill
                priority={index === 0}
                quality={85}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80 flex items-center justify-center">
              <div className="text-center px-6 max-w-4xl">
                <motion.h1
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 relative"
                >
                  <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
                    {slides[index].title}
                  </span>
                  <span className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-[#24eda2] to-[#00a3f8] -z-10" />
                </motion.h1>

                <motion.p
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl text-gray-300 mb-10"
                >
                  {slides[index].subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Link
                    href="/contact"
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] font-semibold hover:scale-105 transition-transform shadow-lg"
                  >
                    Start Your Project
                  </Link>

                  <Link
                    href="#portfolio"
                    className="px-8 py-4 rounded-xl border border-white/20 backdrop-blur-md hover:bg-white/10 transition"
                  >
                    View Our Work
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
          <motion.div
            key={index}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5 }}
            className="h-full bg-gradient-to-r from-[#24eda2] to-[#00a3f8]"
          />
        </div>

        {/* Controls */}
        <button
          onClick={prev}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
        >
          ‹
        </button>

        <button
          onClick={next}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
        >
          ›
        </button>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Our Portfolio</h2>

        <div className="grid md:grid-cols-3 gap-10">
          {portfolio.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-[#24eda2]/40"
            >
              <Image
                src={item.image}
                alt={`${item.title} project preview`}
                width={600}
                height={400}
                loading="lazy"
                className="object-cover w-full h-64"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end p-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-300">{item.description}</p>
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-[#24eda2] hover:underline"
                  >
                    Visit Site →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          What Clients Say
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 hover:scale-105 transition-all duration-500 hover:border-[#24eda2]/40"
            >
              <div className="text-[#24eda2] mb-3">★★★★★</div>
              <p className="mb-4 text-gray-200">“{t.quote}”</p>
              <h4 className="font-semibold">{t.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 bg-black text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#24eda2]/10 to-[#00a3f8]/10 blur-3xl" />

        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 relative z-10">
          Ready to Elevate Your Brand?
        </h2>

        <p className="max-w-2xl mx-auto mb-10 text-gray-300 text-lg relative z-10">
          Let’s build an unforgettable online experience that wins attention,
          drives growth, and positions you as the authority.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
          <Link
            href="/contact"
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] font-semibold hover:scale-105 transition-transform shadow-2xl"
          >
            Book Consultation
          </Link>

          <Link
            href="#portfolio"
            className="px-10 py-4 rounded-xl border border-white/20 hover:bg-white/10 transition"
          >
            See Our Work
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500 relative z-10">
          Limited onboarding slots available this month.
        </p>
      </section>
    </main>
  );
}
