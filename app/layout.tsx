import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
// @ts-ignore: CSS module types are handled by Next.js
import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";
import Navbar from "./components/navigation";
import Footer from "./components/footer";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eccentric Digital",
  description:
    "Professional Web Design Services to Elevate Your Online Presence",
  icons: {
    icon: "/eccentriclogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${urbanist.variable} antialiased`} style={{ fontFamily: "var(--font-urbanist), 'Segoe UI', system-ui, sans-serif" }}>
        <ConditionalLayout navbar={<Navbar />} footer={<Footer />}>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
