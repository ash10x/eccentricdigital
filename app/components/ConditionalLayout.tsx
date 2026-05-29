"use client";

import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}

export default function ConditionalLayout({ children, navbar, footer }: Props) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return <>{children}</>;
  return (
    <>
      {navbar}
      {children}
      {footer}
    </>
  );
}
