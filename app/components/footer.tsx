// app/components/Footer.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-black/80 via-gray-900/80 to-black/90 backdrop-blur-xl border-t border-white/20 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand / Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-center md:items-start"
        >
          <Image
            className="h-auto w-auto"
            src="/eccentriclogowhite.png"
            alt="Logo"
            width={40}
            height={40}
          />
        </motion.div>

        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-center md:items-start space-y-2"
        >
          <h3 className="text-lg font-semibold mb-2">Explore</h3>
          <Link href="/" className="hover:text-[#24eda2] transition-colors">
            Home
          </Link>
          <Link
            href="/packages"
            className="hover:text-[#24eda2] transition-colors"
          >
            Packages
          </Link>
          <Link
            href="/contact"
            className="hover:text-[#24eda2] transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/about"
            className="hover:text-[#24eda2] transition-colors"
          >
            About
          </Link>
        </motion.nav>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col items-center md:items-start"
        >
          <h3 className="text-lg font-semibold mb-2">Connect</h3>
          <div className="flex space-x-4">
            <motion.a
              href="https://twitter.com"
              whileHover={{ scale: 1.1 }}
              className="text-gray-400 hover:text-[#00a3f8] transition-colors"
            >
              Twitter
            </motion.a>
            <motion.a
              href="https://linkedin.com"
              whileHover={{ scale: 1.1 }}
              className="text-gray-400 hover:text-[#24eda2] transition-colors"
            >
              LinkedIn
            </motion.a>
            <motion.a
              href="https://instagram.com"
              whileHover={{ scale: 1.1 }}
              className="text-gray-400 hover:text-pink-400 transition-colors"
            >
              Instagram
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        viewport={{ once: true }}
        className="border-t border-white/10 text-center py-6 text-gray-500 text-sm"
      >
        © {new Date().getFullYear()} Eccentric Digital. All rights reserved.
      </motion.div>
    </footer>
  );
}
