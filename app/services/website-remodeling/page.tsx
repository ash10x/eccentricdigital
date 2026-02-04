"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function CustomWebDesignPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* HERO */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/websiteremodeling.jpg"
          alt="Website Remodeling"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/70" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Website Remodeling
          </h1>
          <p className="text-lg text-gray-300">
            Modernize your site without starting over — we revamp your existing
            website to boost performance, design, and conversions.
          </p>
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold mb-6">
            What This Service Includes
          </h2>

          <p className="text-gray-300 leading-relaxed mb-8">
            We take your existing website and give it a fresh, modern look with
            improved performance and user experience to help you convert more
            visitors into customers.
          </p>

          <ul className="space-y-4 text-gray-200">
            <li>• Performance</li>
            <li>• Modern Redesign</li>
            <li>• Clean Code</li>
            <li>• SEO</li>
            <li>• UX</li>
            <li>• Mobile Optimization</li>
            <li>• Conversion Improvements</li>
          </ul>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-8"
        >
          <h3 className="text-2xl font-semibold mb-6">What You Get</h3>

          <ul className="space-y-4 text-gray-300">
            <li>→ Custom design & layout</li>
            <li>→ Responsive development</li>
            <li>→ SEO-friendly structure</li>
            <li>→ Launch-ready website</li>
          </ul>

          <Link
            href="/contact"
            className="inline-block mt-10 px-8 py-4 rounded-xl
                       bg-gradient-to-r from-[#24eda2] to-[#00a3f8]
                       font-semibold hover:scale-105 transition"
          >
            Get Started
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
