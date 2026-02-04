"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "/" },
  {
    name: "Services",
    href: "/services",
    dropdown: [
      { name: "Custom Web Design", href: "/services/custom-web-design" },
      { name: "Website Remodeling", href: "/services/website-remodeling" },
      { name: "Website Maintenance", href: "/services/website-maintenance" },
      { name: "Quick Start Websites", href: "/services/quick-start-websites" },
    ],
  },
  { name: "Packages", href: "/packages" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full transition-colors duration-500 z-50 ${
        scrolled
          ? "bg-black/70 backdrop-blur-xl border-b border-[#121212] shadow-lg"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              className="w-auto h-12 object-contain transition-all duration-300 ease-in-out hover:scale-105"
              src="/eccentriclogo.png"
              alt="Eccentric Digital Logo"
              width={100}
              height={50}
            />
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => setDropdownOpen(link.name)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <Link href={link.href}>
                  <button
                    aria-expanded={dropdownOpen === link.name}
                    className="text-white hover:text-[#24eda2] transition-colors text-[11pt] font-medium tracking-wider cursor-pointer"
                    onClick={() => setDropdownOpen(null)}
                  >
                    {link.name}
                  </button>
                </Link>
                <AnimatePresence>
                  {dropdownOpen === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      role="menu"
                      className="absolute top-full left-0 mt-2 w-48 rounded-lg bg-black/95 backdrop-blur-md border border-white/30 shadow-xl overflow-hidden"
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          role="menuitem"
                          className="block px-4 py-3 text-white text-[10pt] tracking-wider hover:bg-[#00a3f8]/80 hover:scale-105 transition-transform"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-white hover:text-[#24eda2] transition-colors text-[11pt] font-medium tracking-wider"
              >
                {link.name}
              </Link>
            ),
          )}
          <Link
            href="/contact"
            className="ml-4 px-4 py-2 rounded-lg bg-linear-to-r from-[#24eda2] to-[#00a3f8] text-white hover:opacity-90 transition hover:scale-105 text-[11.5pt] font-semibold tracking-wide"
          >
            Book Consultation
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-100 focus:outline-none z-10"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-white/30 shadow-lg absolute top-0 right-0 w-3/4 h-screen flex flex-col items-center gap-6 py-20"
          >
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.name} className="flex flex-col items-center">
                  <button
                    onClick={() =>
                      setDropdownOpen(
                        dropdownOpen === link.name ? null : link.name,
                      )
                    }
                    aria-expanded={dropdownOpen === link.name}
                    className="text-lg text-white hover:text-[#24eda2] transition"
                  >
                    {link.name}
                  </button>
                  <AnimatePresence>
                    {dropdownOpen === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col mt-2 gap-2"
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="text-white hover:text-[#24eda2] transition"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg text-white hover:text-[#24eda2] transition"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ),
            )}
            <Link
              href="/contact"
              className="px-6 py-3 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition hover:scale-105"
              onClick={() => setIsOpen(false)}
            >
              Book Consultation
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
