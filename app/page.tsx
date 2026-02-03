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
    }, 4500);

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
            transition={{ duration: 0.9 }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <motion.div
              style={{ y: yParallax }}
              className="absolute inset-0 scale-105"
            >
              <Image
                src={slides[index].image}
                alt={slides[index].title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center">
              <div className="text-center px-6 max-w-3xl">
                <motion.h1
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-6xl font-extrabold mb-6"
                >
                  {slides[index].title}
                </motion.h1>

                <motion.p
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg md:text-xl text-gray-200"
                >
                  {slides[index].subtitle}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrow Controls */}
        <button
          aria-label="Previous slide"
          onClick={prev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
        >
          ‹
        </button>

        <button
          aria-label="Next slide"
          onClick={next}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
        >
          ›
        </button>

        {/* Overlay Dots */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        >
          <div className="flex gap-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === i
                    ? "bg-white scale-125"
                    : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* PORTFOLIO */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Our Portfolio</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            "portfolio1",
            "portfolio2",
            "portfolio3",
            "portfolio4",
            "portfolio5",
          ].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-xl overflow-hidden bg-white/10 backdrop-blur-md hover:scale-105 transition-transform"
            >
              <Image
                src={`/images/${img}.jpg`}
                alt="Portfolio project"
                width={600}
                height={400}
                loading="lazy"
                className="object-cover w-full h-64"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">Luxury Web Project</h3>
                <p className="text-sm text-gray-300">
                  Cinematic, modern, conversion-focused.
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VISION */}
      <section className="py-24 bg-gradient-to-r from-gray-800 via-black to-gray-900 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold mb-6"
        >
          Our Vision
        </motion.h2>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg">
          We design cinematic digital experiences that elevate brands into icons
          of modern design.
        </p>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          What Clients Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="rounded-xl bg-white/10 backdrop-blur-md p-6 hover:scale-105 transition-transform"
            >
              <p className="mb-4 text-gray-200">“{t.quote}”</p>
              <h4 className="font-semibold">{t.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-center">
        <h2 className="text-5xl font-extrabold mb-6">
          Ready to Elevate Your Brand?
        </h2>
        <p className="max-w-2xl mx-auto mb-10 text-gray-300 text-lg">
          Let’s craft a cinematic digital experience that captivates your
          audience.
        </p>
        <Link
          href="/consultation"
          aria-label="Book a consultation"
          className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-white font-semibold hover:scale-105 transition-transform"
        >
          Book Consultation
        </Link>
      </section>
    </main>
  );
}
