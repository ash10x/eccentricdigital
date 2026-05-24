"use client";

import Link from "next/link";
import Image from "next/image";

const footerNav = [
  {
    label: "Company",
    links: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Portfolio", href: "/projects" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Services",
    links: [
      { name: "Custom Web Design", href: "/services/custom-web-design" },
      { name: "Website Remodeling", href: "/services/website-remodeling" },
      { name: "Website Maintenance", href: "/services/website-maintenance" },
      { name: "Quick Start Websites", href: "/services/quick-start-websites" },
    ],
  },
  {
    label: "Work",
    links: [
      { name: "Packages", href: "/packages" },
      { name: "Portfolio", href: "/projects" },
      { name: "Book Consultation", href: "/contact" },
    ],
  },
];

const socials = [
  { name: "Twitter / X", href: "https://twitter.com" },
  { name: "LinkedIn", href: "https://linkedin.com" },
  { name: "Instagram", href: "https://instagram.com" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#060606] border-t border-white/[0.06]">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#24eda2]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-20">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/">
              <Image
                src="/eccentriclogowhite.png"
                alt="Eccentric Digital"
                width={44}
                height={44}
                className="mb-6 opacity-80 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-[14px] text-white/35 leading-relaxed max-w-xs">
              We build cinematic, high-performance websites engineered to
              position brands as category leaders.
            </p>

            <div className="flex flex-col gap-2.5 mt-8">
              <a
                href="mailto:support@eccentricdigital.com"
                className="text-[13px] text-white/35 hover:text-[#24eda2] transition-colors"
              >
                support@eccentricdigital.com
              </a>
              <a
                href="tel:+18768449466"
                className="text-[13px] text-white/35 hover:text-[#24eda2] transition-colors"
              >
                +1 (876) 844-9466
              </a>
            </div>

            <div className="flex flex-wrap gap-5 mt-6">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-white/25 hover:text-[#24eda2] transition-colors"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {footerNav.map((col) => (
            <div key={col.label}>
              <p className="text-[10px] uppercase tracking-[3.5px] text-white/18 font-semibold mb-5">
                {col.label}
              </p>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-white/35 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.05]">
          <p className="text-[12px] text-white/20">
            © {new Date().getFullYear()} Eccentric Digital. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24eda2] animate-pulse" />
            <span className="text-[12px] text-white/20">
              Available for new projects
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
