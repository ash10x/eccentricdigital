"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <main className="lg:pl-56 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </>
  );
}
