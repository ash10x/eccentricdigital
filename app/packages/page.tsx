"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

/* ---------------- Fade Wrapper ---------------- */
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

export default function PackagesPage() {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, -120]);

  const [showComparison, setShowComparison] = useState(false);

  const packages = [
    {
      title: "Business Professional",
      serviceKey: "custom-design",
      description:
        "Custom websites made simple. Fast, sleek, and designed to turn clicks into customers.",
      image: "/images/businesspro.jpg",
      price: "$200",
      features: [
        "Custom Design",
        "SEO Optimization",
        "1 Domain Name",
        "1 Business Email",
        "1 Month Free Hosting",
        "1-3 Days Delivery (Approx)",
        "Reliable Support",
      ],
    },
    {
      title: "E-commerce & Engagement",
      serviceKey: "ecommerce",
      description:
        "Launch a custom eCommerce store designed to sell, scale, and delight your customers.",
      image: "/images/ecommerce.jpg",
      price: "$350",
      features: [
        "Custom Design",
        "SEO Optimization",
        "1 Domain Name",
        "1 Business Email",
        "1 Month Free Maintenance",
        "3 Month Free Hosting",
        "3-7 Days Delivery (Approx)",
        "Reliable Support",
      ],
      featured: true,
    },
    {
      title: "Legacy Impact",
      serviceKey: "custom-design",
      description:
        "Elevate your online presence with a website tailored to your brand. Seamless design, flawless performance, maximum impact.",
      image: "/images/legacyimpact.jpg",
      price: "$500",
      features: [
        "Custom Design",
        "SEO Optimization",
        "Unlimited Domain Names",
        "Unlimited Business Emails",
        "3 Month Free Maintenance",
        "3 Month Free Hosting",
        "7-14 Days Delivery (Approx)",
        "Advanced Animations",
        "Brand Strategy",
        "Priority Support",
      ],
    },
  ];

  return (
    <main className="bg-linear-to-br from-gray-900 via-black to-gray-800 text-white min-h-screen overflow-hidden">
      {/* ---------------- HERO ---------------- */}
      <section
        ref={ref}
        className="relative h-[55vh] md:h-[65vh] flex items-center justify-center"
      >
        <motion.div style={{ y: yParallax }} className="absolute inset-0">
          <Image
            src="/images/backdrop.png"
            alt="Packages"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        {/* Depth Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/70 to-black/90" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-[0_0_20px_rgba(36,237,162,0.4)]">
            Pricing Packages
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300">
            Flexible pricing for fast launches, scalable growth, and premium
            digital experiences.
          </p>
        </motion.div>
      </section>

      {/* ---------------- PACKAGE CARDS ---------------- */}
      <section className="pt-20 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {packages.map((pkg, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03, rotateX: 3, rotateY: -3 }}
            transition={{ duration: 0.4 }}
            className={`relative rounded-2xl backdrop-blur-xl border shadow-xl overflow-hidden flex flex-col
              ${pkg.featured ? "border-[#24eda2] bg-black/70" : "border-white/10 bg-black/50"}`}
          >
            {pkg.featured && (
              <span className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full bg-[#24eda2] text-black font-semibold">
                Most Popular
              </span>
            )}

            <Image
              src={pkg.image}
              alt={pkg.title}
              width={600}
              height={400}
              className="w-full h-56 object-cover"
            />

            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold mb-2 text-center">
                {pkg.title}
              </h3>
              <p className="text-gray-300 text-sm mb-4">{pkg.description}</p>

              <ul className="text-sm text-gray-400 mb-6 space-y-1">
                {pkg.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-4xl tracking-tight font-bold text-[#24eda2]">
                  {pkg.price}
                  <span className="text-sm"> USD</span>
                </span>

                <a
                  href={`/contact?service=${
                    pkg.title.includes("E-commerce")
                      ? "ecommerce"
                      : pkg.title.includes("Legacy")
                        ? "custom-design"
                        : "custom-design"
                  }&package=${encodeURIComponent(pkg.title)}`}
                  className="px-5 py-2 rounded-lg bg-linear-to-r from-[#24eda2] to-[#00a3f8] text-black font-semibold hover:scale-105 transition"
                >
                  Get Started
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ---------------- COMPARISON TOGGLE ---------------- */}
      <div className="text-center mt-20">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="text-sm text-[#24eda2] hover:underline mb-10"
        >
          {showComparison ? "Hide full comparison ↑" : "Compare all features ↓"}
        </button>
      </div>

      {/* ---------------- COMPARISON TABLE ---------------- */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto px-4 mt-12 overflow-x-auto mb-10"
          >
            <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
              <thead className="bg-white/10">
                <tr>
                  <th className="p-4 text-left">Feature</th>
                  <th className="p-4">Business Professional</th>
                  <th className="p-4 text-[#24eda2]">
                    E-commerce & Engagement
                  </th>
                  <th className="p-4">Legacy Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  ["Custom Design", "✔", "✔", "✔"],
                  ["SEO Optimization", "✔", "✔", "✔"],
                  ["Responsive Layout", "✔", "✔", "✔"],
                  ["Domain Name", "✔", "✔", "✔"],
                  ["Business Email", "✔", "✔", "✔"],
                  ["Advanced Animations", "—", "—", "✔"],
                  ["Free Maintenance", "—", "✔", "✔"],
                  ["Free Hosting", "—", "✔", "✔"],
                  ["Priority Support", "—", "—", "✔"],
                ].map(([feature, s, p, pr]) => (
                  <tr key={feature}>
                    <td className="p-4 text-gray-300">{feature}</td>
                    <td className="p-4 text-center">{s}</td>
                    <td className="p-4 text-center">{p}</td>
                    <td className="p-4 text-center">{pr}</td>
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
