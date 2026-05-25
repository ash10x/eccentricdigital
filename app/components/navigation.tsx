"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
  { name: "Portfolio", href: "/projects" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(null);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#060606]/80 backdrop-blur-2xl border-b border-white/[0.06]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/eccentriclogo.png"
            alt="Eccentric Digital"
            width={100}
            height={40}
            className="h-10 w-auto object-contain hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => setDropdownOpen(link.name)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <button
                  className={`px-4 py-2 rounded-lg text-[13px] font-medium tracking-[-0.01em] transition-colors ${
                    pathname.startsWith(link.href)
                      ? "text-[#24eda2]"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.name}
                  <span className="ml-1 text-[10px] opacity-40">▾</span>
                </button>

                <AnimatePresence>
                  {dropdownOpen === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-52 rounded-xl bg-[#0e0e0e] border border-white/[0.08] shadow-2xl shadow-black/60 overflow-hidden"
                    >
                      {link.dropdown.map((item, i) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center px-4 py-3 text-[13px] transition-colors ${
                            i < link.dropdown.length - 1
                              ? "border-b border-white/[0.05]"
                              : ""
                          } ${
                            pathname === item.href
                              ? "text-[#24eda2]"
                              : "text-white/70 hover:text-white hover:bg-white/[0.03]"
                          }`}
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
                className={`px-4 py-2 rounded-lg text-[13px] font-medium tracking-[-0.01em] transition-colors ${
                  pathname === link.href
                    ? "text-[#24eda2]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            )
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/payment"
            className={`px-4 py-2 rounded-lg text-[13px] font-medium tracking-[-0.01em] border transition-colors ${
              pathname === "/payment"
                ? "border-[#24eda2]/40 text-[#24eda2]"
                : "border-white/[0.08] text-white/50 hover:border-white/20 hover:text-white"
            }`}
          >
            Payment Portal
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2 rounded-lg text-[13px] font-semibold tracking-[-0.01em] bg-white text-black hover:bg-white/90 transition-colors"
          >
            Book Consultation
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            className="block w-5 h-[1.5px] bg-white origin-center transition-all"
          />
          <motion.span
            animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            className="block w-5 h-[1.5px] bg-white"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            className="block w-5 h-[1.5px] bg-white origin-center transition-all"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-72 bg-[#0a0a0a] border-l border-white/[0.06] z-50 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-white/[0.06]">
                <span className="text-sm font-semibold text-white/40 uppercase tracking-widest">Menu</span>
                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navLinks.map((link) =>
                  link.dropdown ? (
                    <div key={link.name}>
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === link.name ? null : link.name)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium text-white/70 hover:text-white hover:bg-white/[0.03] transition-colors"
                      >
                        {link.name}
                        <span className={`text-xs transition-transform ${dropdownOpen === link.name ? "rotate-180" : ""}`}>▾</span>
                      </button>
                      <AnimatePresence>
                        {dropdownOpen === link.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 overflow-hidden"
                          >
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2.5 text-[14px] text-white/50 hover:text-white transition-colors"
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
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                        pathname === link.href
                          ? "text-[#24eda2]"
                          : "text-white/70 hover:text-white hover:bg-white/[0.03]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  )
                )}
              </div>

              <div className="p-4 border-t border-white/[0.06] space-y-2">
                <Link
                  href="/payment"
                  onClick={() => setIsOpen(false)}
                  className={`block w-full py-3 rounded-xl text-center text-[14px] font-medium border transition-colors ${
                    pathname === "/payment"
                      ? "border-[#24eda2]/40 text-[#24eda2]"
                      : "border-white/8 text-white/50 hover:border-white/20 hover:text-white"
                  }`}
                >
                  Payment Portal
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3 rounded-xl text-center text-[14px] font-bold bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black"
                >
                  Book Consultation
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
