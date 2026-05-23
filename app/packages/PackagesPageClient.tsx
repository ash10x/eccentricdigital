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

type Package = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  features: string[];
  paymentType: string;
  isFeatured: boolean;
};

export default function PackagesPageClient({
  packages,
}: {
  packages: Package[];
}) {
  const heroRef = useRef(null);
  const [showComparison, setShowComparison] = useState(false);

  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroParallax = useTransform(scrollY, [0, 600], [0, -140]);

  return (
    <main className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-[#24eda2] origin-left z-50"
      />

      {/* HERO */}
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
            We don&apos;t build pages. We build unfair digital advantages. Choose
            your growth tier.
          </p>
        </motion.div>
      </section>

      {/* STORY */}
      <section className="py-32 bg-linear-to-b from-black to-neutral-900 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-5xl font-extrabold mb-6">
            From &quot;Just a Website&quot;
            <br />
            to <span className="text-[#24eda2]">Growth Engine</span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Strategy. Design. Psychology. Performance. Every layer engineered
            for conversions.
          </p>
        </motion.div>
      </section>

      {/* PRICING CARDS */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {packages.map((pkg) => (
          <motion.div
            key={pkg.id}
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
                pkg.isFeatured
                  ? "border-[#24eda2] bg-linear-to-b from-black/80 to-black/60"
                  : "border-white/10 bg-white/5"
              }
            `}
          >
            {pkg.isFeatured && (
              <div className="absolute top-4 right-4 bg-[#24eda2] text-black text-xs px-3 py-1 rounded-full font-bold">
                MOST POPULAR
              </div>
            )}

            <Image
              src={pkg.imageUrl}
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
                  <p className="text-gray-400 font-semibold text-sm mt-1.5">
                    {pkg.paymentType}
                  </p>

                  {pkg.isFeatured && (
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

      {/* COMPARISON */}
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
    </main>
  );
}
