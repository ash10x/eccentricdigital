"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  { name: "FAQs", href: "/faq" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const mobileMenu = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "288px", zIndex: 9999, background: "#0a0a0a", borderLeft: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column" }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: "64px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "4px" }}>Menu</span>
              <button onClick={() => setIsOpen(false)} style={{ color: "rgba(255,255,255,0.4)", background: "none", border: "none", fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>

            {/* Nav links */}
            <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.name}>
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === link.name ? null : link.name)}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "12px", fontSize: "15px", fontWeight: 500, color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                    >
                      {link.name}
                      <span style={{ fontSize: "11px", transform: dropdownOpen === link.name ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
                    </button>
                    <AnimatePresence>
                      {dropdownOpen === link.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ overflow: "hidden", paddingLeft: "16px" }}
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              style={{ display: "block", padding: "10px 16px", fontSize: "14px", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
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
                    style={{ display: "block", padding: "12px 16px", borderRadius: "12px", fontSize: "15px", fontWeight: 500, color: pathname === link.href ? "#24eda2" : "rgba(255,255,255,0.7)", textDecoration: "none" }}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>

            {/* Footer CTAs */}
            <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link
                href="/payment"
                onClick={() => setIsOpen(false)}
                style={{ display: "block", width: "100%", padding: "12px 0", borderRadius: "12px", textAlign: "center", fontSize: "14px", fontWeight: 500, border: pathname === "/payment" ? "1px solid rgba(36,237,162,0.4)" : "1px solid rgba(255,255,255,0.08)", color: pathname === "/payment" ? "#24eda2" : "rgba(255,255,255,0.5)", textDecoration: "none", boxSizing: "border-box" }}
              >
                Payment Portal
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                style={{ display: "block", width: "100%", padding: "12px 0", borderRadius: "12px", textAlign: "center", fontSize: "14px", fontWeight: 700, background: "linear-gradient(90deg, #24eda2, #00a3f8)", color: "#000", textDecoration: "none", boxSizing: "border-box" }}
              >
                Book Consultation
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-2xl border-b border-white/6"
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

          {/* Desktop nav links */}
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
                        className="absolute top-full left-0 mt-2 w-52 rounded-xl bg-[#0e0e0e] border border-white/8 shadow-2xl shadow-black/60 overflow-hidden"
                      >
                        {link.dropdown.map((item, i) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-3 text-[13px] transition-colors ${
                              i < link.dropdown.length - 1 ? "border-b border-white/5" : ""
                            } ${
                              pathname === item.href
                                ? "text-[#24eda2]"
                                : "text-white/70 hover:text-white hover:bg-white/3"
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
                    pathname === link.href ? "text-[#24eda2]" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/payment"
              className={`px-4 py-2 rounded-lg text-[13px] font-medium tracking-[-0.01em] border transition-colors ${
                pathname === "/payment"
                  ? "border-[#24eda2]/40 text-[#24eda2]"
                  : "border-white/8 text-white/50 hover:border-white/20 hover:text-white"
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

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.25"
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
      </nav>

      {/* Portal — renders directly into document.body, bypasses all stacking contexts */}
      {mounted && createPortal(mobileMenu, document.body)}
    </>
  );
}
