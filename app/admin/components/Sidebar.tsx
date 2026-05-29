"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "⊞" },
  { href: "/admin/submissions", label: "Submissions", icon: "✉" },
  { href: "/admin/projects", label: "Projects", icon: "◈" },
  { href: "/admin/services", label: "Services", icon: "⬡" },
  { href: "/admin/packages", label: "Packages", icon: "⬜" },
  { href: "/admin/team", label: "Team", icon: "⊕" },
  { href: "/admin/stats", label: "Stats", icon: "▦" },
  { href: "/admin/users", label: "Users", icon: "⊛" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const NavLinks = () => (
    <>
      <div className="px-4 flex flex-col items-center py-6 border-b border-white/5">
        <Image
          src="/eccentriclogo.png"
          alt="Eccentric Digital Logo"
          width={32}
          height={32}
          className="mb-2"
        />
        <p className="text-white/30 text-xs mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-[#24eda2]/10 text-[#24eda2]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <span className="text-base w-5 text-center">⏏</span>
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0d0d0d] border border-white/10 rounded-lg text-white/60"
      >
        <span className="text-lg">{open ? "✕" : "☰"}</span>
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 h-screen bg-[#080808] border-r border-white/5 fixed left-0 top-0 z-30">
        <NavLinks />
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden flex flex-col w-56 h-screen bg-[#080808] border-r border-white/5 fixed left-0 top-0 z-50 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavLinks />
      </aside>
    </>
  );
}
