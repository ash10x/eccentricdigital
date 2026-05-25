"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

type Package = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  features: string[];
  paymentType: string;
  isFeatured: boolean;
  serviceKeys: string[];
};

type Currency = "JMD" | "USD";

const categories = [
  { key: "custom-design", label: "Custom Web Design" },
  { key: "ecommerce", label: "E-commerce" },
  { key: "remodeling", label: "Website Remodeling" },
  { key: "maintenance", label: "Website Maintenance" },
  { key: "__other__", label: "Quick Start" },
];

function groupPackages(packages: Package[]) {
  const groups: Record<string, Package[]> = {};
  for (const cat of categories) groups[cat.key] = [];

  for (const pkg of packages) {
    const key = pkg.serviceKeys[0] ?? "__other__";
    const matched = categories.find((c) => c.key === key);
    (matched ? groups[matched.key] : groups["__other__"]).push(pkg);
  }

  return categories.filter((c) => groups[c.key].length > 0).map((c) => ({
    ...c,
    packages: groups[c.key],
  }));
}

function parseJmdAmount(price: string): number {
  return parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
}

function formatPrice(jmdAmount: number, currency: Currency, rate: number | null): string {
  if (currency === "JMD" || rate === null) {
    return "$" + jmdAmount.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  const usd = jmdAmount / rate;
  return "$" + usd.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function PackagesPageClient({ packages }: { packages: Package[] }) {
  const grouped = groupPackages(packages);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressScale = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const [currency, setCurrency] = useState<Currency>("JMD");
  const [rate, setRate] = useState<number | null>(null);
  const [rateFallback, setRateFallback] = useState(false);

  useEffect(() => {
    fetch("/api/exchange-rate")
      .then((r) => r.json())
      .then((data) => {
        if (data.rate) {
          setRate(data.rate);
          setRateFallback(!!data.fallback);
        }
      })
      .catch(() => {
        setRate(157);
        setRateFallback(true);
      });
  }, []);

  return (
    <main ref={containerRef} className="bg-[#060606] text-white overflow-x-hidden relative">
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progressScale }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#24eda2] to-[#00a3f8] origin-left z-50"
      />

      {/* ── HERO ── */}
      <section className="relative min-h-[80vh] flex items-center justify-center text-center px-6 overflow-hidden pt-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#24eda2]/[0.05] blur-[120px]" />
          <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full bg-[#00a3f8]/[0.04] blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#24eda2] animate-pulse" />
            <span className="text-[11px] uppercase tracking-[3px] text-white/50 font-semibold">
              Investment Tiers
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[52px] md:text-[76px] lg:text-[88px] font-black leading-[0.92] tracking-[-0.04em] mb-8"
          >
            Not Just
            <br />
            Websites.
            <br />
            <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
              Revenue Machines.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-[17px] text-white/40 max-w-xl mx-auto leading-relaxed tracking-[-0.01em] mb-10"
          >
            We don&apos;t build pages. We build unfair digital advantages.
            Choose your growth tier.
          </motion.p>

          {/* Currency toggle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              {(["JMD", "USD"] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-5 py-2 rounded-lg text-[12px] font-bold tracking-[1.5px] uppercase transition-all duration-250 ${
                    currency === c
                      ? "bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black shadow-[0_4px_20px_rgba(36,237,162,0.25)]"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {rate !== null && (
              <p className="text-[11px] text-white/20 tracking-[0.5px]">
                {rateFallback ? "~" : ""}1 USD ≈ {rate.toLocaleString("en-US", { maximumFractionDigits: 2 })} JMD
                {rateFallback && <span className="ml-1">(estimated)</span>}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section className="py-32 px-6 max-w-7xl mx-auto space-y-24">
        {grouped.map((group) => (
          <div key={group.key}>
            {/* Category header */}
            <div className="mb-12">
              <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-3">
                Service
              </p>
              <h2 className="text-[36px] md:text-[44px] font-black tracking-[-0.04em] leading-none">
                {group.label}
              </h2>
              <div className="mt-4 h-[1px] bg-gradient-to-r from-[#24eda2]/20 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.packages.map((pkg, i) => {
                const jmdAmount = parseJmdAmount(pkg.price);
                const displayPrice = formatPrice(jmdAmount, currency, rate);

                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, delay: i * 0.1 }}
                    className={`relative rounded-2xl flex flex-col overflow-hidden transition-all duration-500 ${
                      pkg.isFeatured
                        ? "gradient-border-strong"
                        : "border border-white/[0.06] bg-white/[0.02]"
                    }`}
                  >
                    {pkg.isFeatured && (
                      <div className="absolute top-5 right-5 z-10">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black text-[10px] font-bold uppercase tracking-[1.5px]">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="p-8 flex flex-col grow">
                      {/* Header */}
                      <div className="mb-8 pb-8 border-b border-white/[0.06]">
                        <h3 className="text-[22px] font-bold tracking-[-0.03em] mb-3">
                          {pkg.title}
                        </h3>
                        <p className="text-white/40 text-[13px] leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="mb-8">
                        <div className="flex items-baseline gap-2">
                          <motion.span
                            key={`${pkg.id}-${currency}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`text-[52px] font-black tracking-[-0.04em] leading-none ${
                              pkg.isFeatured
                                ? "bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent"
                                : "text-white"
                            }`}
                          >
                            {displayPrice}
                          </motion.span>
                          <span className="text-white/30 text-[13px] font-semibold uppercase tracking-[1px]">
                            {currency}
                          </span>
                        </div>
                        <p className="text-[12px] text-white/25 uppercase tracking-[2px] mt-2 font-semibold">
                          {pkg.paymentType}
                        </p>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-10 grow">
                        {pkg.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <span className="text-[#24eda2] text-[12px] mt-0.5 shrink-0 font-bold">✓</span>
                            <span className="text-[13px] text-white/55 leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <Link
                        href={`/contact?package=${encodeURIComponent(pkg.title)}`}
                        className={`block w-full py-3.5 rounded-xl text-center text-[14px] font-bold tracking-[-0.01em] transition-all duration-300 ${
                          pkg.isFeatured
                            ? "bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black hover:shadow-[0_16px_48px_rgba(36,237,162,0.3)] hover:-translate-y-0.5"
                            : "border border-white/[0.1] text-white/70 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        Start This Project →
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="py-8 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            "Strategy-led approach",
            "Performance-first builds",
            "Limited spots per quarter",
            "Full ownership, no lock-in",
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2.5"
            >
              <span className="w-1 h-1 rounded-full bg-[#24eda2]/60" />
              <span className="text-[12px] text-white/30 font-medium tracking-[-0.01em]">
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-48 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#24eda2]/[0.04] blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-8">
              Not Sure Which Tier?
            </p>
            <h2 className="text-[52px] md:text-[68px] font-black leading-[0.9] tracking-[-0.04em] mb-8">
              Let&apos;s Find the
              <br />
              <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
                Right Fit Together.
              </span>
            </h2>
            <p className="text-white/35 text-[16px] max-w-lg mx-auto mb-12 leading-relaxed tracking-[-0.01em]">
              Book a free strategy call. We&apos;ll assess your goals and recommend
              the package that gives you the highest ROI.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black font-bold text-[16px] tracking-[-0.02em] hover:shadow-[0_24px_80px_rgba(36,237,162,0.35)] hover:-translate-y-1 transition-all duration-300"
            >
              Book a Free Strategy Call →
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
