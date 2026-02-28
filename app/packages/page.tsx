"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

export default function PackagesPage() {
  const heroRef = useRef(null);
  const [showComparison, setShowComparison] = useState(false);

  /* ---------------- Scroll Systems ---------------- */

  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroParallax = useTransform(scrollY, [0, 600], [0, -140]);

  /* ---------------- Packages ---------------- */

  const packages = [
    {
      title: "Business Professional",
      description:
        "Perfect for founders who need authority fast. Clean. Strategic. Conversion-ready.",
      image: "/images/businesspro.jpg",
      price: "$25,000",
      features: [
        "Custom Website Design",
        "SEO Optimization",
        "1 Domain Name",
        "1 Business Email",
        "1 Month Free Hosting",
        "1-3 Day Delivery",
        "Human Support (No Bots)",
      ],
      paymentType: "One-time investment",
    },
    {
      title: "E-commerce & Engagement",
      description:
        "Our most chosen tier. Built to sell, scale, and automate revenue.",
      image: "/images/ecommerce.jpg",
      price: "$50,000",
      featured: true,
      features: [
        "Custom Website Design",
        "SEO Optimization",
        "Sales-Optimized Store",
        "1 Domain Name",
        "3 Months Free Hosting",
        "3-7 Day Delivery",
        "Priority Support",
      ],
      paymentType: "One-time investment",
    },
    {
      title: "Legacy Impact",
      description:
        "For brands that refuse to blend in. Strategy-first. Animation-rich. Category-defining.",
      image: "/images/legacyimpact.jpg",
      price: "$80,000",
      features: [
        "Advanced Custom Website Design",
        "Conversion Strategy",
        "Unlimited Domains",
        "Unlimited Emails",
        "Advanced Animations",
        "Brand Strategy Session",
        "Priority VIP Support",
      ],
      paymentType: "One-time investment",
    },
    {
      title: "Website Maintenance",
      description:
        "Keep your site fresh, fast, and secure with our ongoing maintenance plan.",
      image: "/images/maintenancepkg.jpg",
      price: "$15,000",
      features: [
        "Monthly Content Updates",
        "SEO Audits & Optimization",
        "Performance Monitoring",
        "Security Updates",
        "Regular Backups",
        "Uptime Monitoring",
        "Priority Support",
      ],
      paymentType: "Monthly subscription",
    },
    {
      title: "Website Redesign",
      description:
        "Give your existing site a powerful facelift with our redesign package. Perfect for businesses looking to refresh their online presence without starting from scratch.",
      image: "/images/redesignpkg.jpeg",
      price: "$50,000",
      features: [
        "Conversion Strategy",
        "Custom Redesign",
        "SEO Optimization",
        "Performance Optimization",
        "Brand Strategy Session",
        "Priority VIP Support",
      ],
      paymentType: "One-time investment",
    },
    {
      title: "Quick Start Website",
      description:
        "A fast-track option for startups and small businesses that need a sleek, conversion-ready site without the wait.",
      image: "/images/quickstartwebsites.jpg",
      price: "$20,000",
      features: [
        "Conversion Strategy",
        "Custom Design Template",
        "SEO Optimization",
        "Performance Optimization",
        "Brand Strategy Session",
        "Priority VIP Support",
      ],
      paymentType: "One-time investment",
    },
  ];

  return (
    <main className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-[#24eda2] origin-left z-50"
      />

      {/* ================= HERO ================= */}

      <section
        ref={heroRef}
        className="relative h-[65vh] flex items-center justify-center text-center px-6"
      >
        <motion.div style={{ y: heroParallax }} className="absolute inset-0">
          <Image
            src="/images/backdrop.png"
            alt="Pricing Background"
            fill
            priority
            className="object-cover opacity-40"
          />
        </motion.div>

        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/70 to-black" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-4xl"
        >
          <h1 className="text-5xl md:text-5xl font-black leading-tight mb-6">
            Not Just Websites.
            <br />
            <span className="bg-linear-to-r from-[#24eda2] text-6xl to-[#00a3f8] bg-clip-text text-transparent">
              Revenue Machines.
            </span>
          </h1>

          <p className="text-md text-gray-300 max-w-2xl mx-auto">
            We don’t build pages. We build unfair digital advantages. Choose
            your growth tier.
          </p>
        </motion.div>
      </section>

      {/* ================= STORY SECTION 1 ================= */}

      {/* <section className="py-32 text-center max-w-4xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-3xl md:text-5xl font-bold leading-tight"
        >
          Most websites don’t fail.
          <br />
          They just quietly underperform.
        </motion.h2>

        <p className="mt-8 text-gray-400 text-md max-w-2xl mx-auto">
          Slow. Forgettable. Built to exist — not convert. That’s not how we
          operate.
        </p>
      </section> */}

      {/* ================= STORY SECTION 2 ================= */}

      <section className="py-32 bg-linear-to-b from-black to-neutral-900 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-5xl font-extrabold mb-6">
            From “Just a Website”
            <br />
            to <span className="text-[#24eda2]">Growth Engine</span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Strategy. Design. Psychology. Performance. Every layer engineered
            for conversions.
          </p>
        </motion.div>
      </section>

      {/* ================= PRICING CARDS ================= */}

      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {packages.map((pkg, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.4 }}
            className={`
              relative rounded-3xl backdrop-blur-2xl border
              shadow-[0_20px_60px_rgba(0,0,0,0.6)]
              overflow-hidden flex flex-col
              transition-all duration-500
              hover:-translate-y-4
              hover:shadow-[0_0_80px_rgba(36,237,162,0.25)]
              ${
                pkg.featured
                  ? "border-[#24eda2] bg-linear-to-b from-black/80 to-black/60"
                  : "border-white/10 bg-white/5"
              }
            `}
          >
            {pkg.featured && (
              <div className="absolute top-4 right-4 bg-[#24eda2] text-black text-xs px-3 py-1 rounded-full font-bold">
                MOST POPULAR
              </div>
            )}

            <Image
              src={pkg.image}
              alt={pkg.title}
              width={600}
              height={400}
              className="w-full h-56 object-cover"
            />

            <div className="p-8 flex flex-col grow">
              <h3 className="text-2xl font-bold mb-3 text-center">
                {pkg.title}
              </h3>

              <p className="text-gray-400 text-sm mb-6 text-center">
                {pkg.description}
              </p>

              <ul className="text-sm text-gray-300 mb-8 space-y-2">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-[#24eda2]">✔</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto text-center">
                <div className="mb-4">
                  <span className="text-5xl font-black text-[#24eda2] after:content-['JMD'] after:text-sm after:font-bold after:ml-1">
                    {pkg.price}
                  </span>
                  <p
                    className="text-gray-400 font-semibold text-sm mt-1.5
                    "
                  >
                    {pkg.paymentType}
                  </p>

                  {pkg.featured && (
                    <p className="text-xs text-[#24eda2] mt-2">
                      🔥 Most clients choose this tier
                    </p>
                  )}
                </div>

                <a
                  href={`/contact?package=${encodeURIComponent(pkg.title)}`}
                  className="inline-block w-full py-3 rounded-xl 
                             bg-linear-to-r from-[#24eda2] to-[#00a3f8]
                             text-black font-bold
                             shadow-xl hover:scale-105 transition"
                >
                  Start This Project →
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ================= COMPARISON ================= */}

      <div className="text-center pb-24">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="text-[#24eda2] hover:underline"
        >
          {showComparison ? "Hide Full Comparison ↑" : "Compare All Features ↓"}
        </button>
      </div>

      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto px-6 pb-24 overflow-x-auto"
          >
            <table className="w-full text-sm border border-white/10 rounded-2xl overflow-hidden">
              <thead className="bg-white/10">
                <tr>
                  <th className="p-4 text-left">Feature</th>
                  <th className="p-4">Business</th>
                  <th className="p-4 text-[#24eda2]">E-commerce</th>
                  <th className="p-4">Legacy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  ["Custom Design", "✔", "✔", "✔"],
                  ["SEO Optimization", "✔", "✔", "✔"],
                  ["Advanced Animations", "—", "—", "✔"],
                  ["Priority Support", "—", "✔", "✔"],
                ].map(([feature, a, b, c]) => (
                  <tr key={feature}>
                    <td className="p-4 text-gray-300">{feature}</td>
                    <td className="p-4 text-center">{a}</td>
                    <td className="p-4 text-center">{b}</td>
                    <td className="p-4 text-center">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= STICKY CTA ================= */}

      {/* <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <a
          href="/contact"
          className="px-10 py-4 rounded-full bg-linear-to-r 
                     from-[#24eda2] to-[#00a3f8]
                     text-black font-bold shadow-2xl
                     hover:scale-105 transition"
        >
          Start My Project →
        </a>
      </div> */}
    </main>
  );
}
