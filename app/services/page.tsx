"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

/* ---------------- Types ---------------- */
type Service = {
  title: string;
  tags: string[];
  description: string;
  image: string;
  route: string;
};

/* ---------------- Data ---------------- */
const services: Service[] = [
  {
    title: "Custom Web Design",
    tags: ["Design", "UX", "Conversion"],
    description:
      "Cinematic digital experiences engineered to position you as the authority.",
    image: "/images/customwebsites.jpg",
    route: "/services/custom-web-design",
  },
  {
    title: "Website Remodeling",
    tags: ["Redesign", "Performance", "SEO"],
    description:
      "We rebuild outdated websites into modern revenue-generating platforms.",
    image: "/images/websiteremodeling.jpg",
    route: "/services/website-remodeling",
  },
  {
    title: "Website Maintenance",
    tags: ["Security", "Optimization", "Support"],
    description:
      "Elite-level performance monitoring and proactive optimization.",
    image: "/images/websitemaintenance.jpg",
    route: "/services/website-maintenance",
  },
  {
    title: "Quick Start Websites",
    tags: ["Launch", "Fast", "Professional"],
    description: "Premium launch-ready websites built for serious startups.",
    image: "/images/quicksite.jpg",
    route: "/services/quick-start-websites",
  },
];

/* ---------------- Magnetic Hook ---------------- */
const useMagnetic = () => {
  const rotateX = useSpring(0, { stiffness: 120, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;

    rotateX.set(-dy * 6);
    rotateY.set(dx * 6);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return { rotateX, rotateY, handleMouseMove, reset };
};

/* ---------------- Card ---------------- */
const MagneticCard = ({ service }: { service: Service }) => {
  const { rotateX, rotateY, handleMouseMove, reset } = useMagnetic();

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Link href={service.route}>
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={reset}
          style={{ rotateX, rotateY, transformPerspective: 1000 }}
          whileHover={{ scale: 1.03 }}
          className="group relative rounded-3xl overflow-hidden
                     bg-white/4
                     border border-white/10
                     backdrop-blur-2xl
                     hover:border-[#24eda2]/40
                     transition-all duration-500"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-linear-to-br from-[#24eda2]/10 to-[#00a3f8]/10" />

          <Image
            src={service.image}
            alt={service.title}
            width={600}
            height={400}
            className="object-cover w-full h-64 transition-transform duration-700 group-hover:scale-110"
          />

          <div className="p-10 space-y-6 relative z-10">
            <div className="flex flex-wrap gap-2 text-xs text-white/60 uppercase tracking-wide">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="text-2xl font-bold tracking-tight">
              {service.title}
            </h3>

            <p className="text-gray-400 leading-relaxed">
              {service.description}
            </p>

            <span className="inline-block text-[#24eda2] opacity-0 group-hover:opacity-100 transition duration-500">
              Explore Service →
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

/* ---------------- Page ---------------- */
export default function ServicesPage() {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const yParallax = shouldReduceMotion
    ? 0
    : useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <main className="bg-black text-white overflow-hidden">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative h-[75vh] flex items-center justify-center text-center px-6"
      >
        <motion.div style={{ y: yParallax }} className="absolute inset-0">
          <Image
            src="/images/backdrop.png"
            alt="Eccentric Digital Services"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/85 to-black" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-4xl"
        >
          <h1 className="text-5xl md:text-5xl font-extrabold leading-tight tracking-tight">
            We Don’t Offer Services.
            <br />
            <span className="bg-linear-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
              We Build Digital Weapons.
            </span>
          </h1>

          <p className="mt-8 text-gray-300 text-md max-w-2xl mx-auto leading-relaxed">
            Every engagement is engineered for authority, performance, and
            consistent conversion.
          </p>
        </motion.div>
      </section>

      {/* AGITATION */}
      <section className="py-36 text-center max-w-4xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-10 tracking-tight"
        >
          Most Websites Are Digital Decorations.
        </motion.h2>

        <p className="text-gray-400 text-md leading-relaxed">
          They look decent.
          <br />
          They function.
          <br />
          <br />
          But they don’t position you.
          <br />
          They don’t convert consistently.
          <br />
          They don’t scale with ambition.
        </p>
      </section>

      {/* SERVICES */}
      <section className="py-28 max-w-7xl mx-auto px-6">
        <motion.div
          className="grid md:grid-cols-2 gap-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.25 } },
          }}
        >
          {services.map((service) => (
            <MagneticCard key={service.title} service={service} />
          ))}
        </motion.div>
      </section>

      {/* AUTHORITY STRIP */}
      <section className="py-28 bg-linear-to-r from-[#24eda2]/10 to-[#00a3f8]/10 text-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16">
          <div>
            <h3 className="text-4xl font-bold">+120%</h3>
            <p className="text-gray-400 mt-2">Average Conversion Lift</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">98%</h3>
            <p className="text-gray-400 mt-2">Client Retention</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">1.2s</h3>
            <p className="text-gray-400 mt-2">Optimized Load Speeds</p>
          </div>
        </div>
      </section>

      {/* CLOSE */}
      <section className="py-44 text-center bg-black px-6">
        <h2 className="text-5xl md:text-5xl font-extrabold mb-10 tracking-tight">
          If You’re Serious About Growth —
          <br />
          Let’s Build the Platform That Proves It.
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto mb-14">
          We take on a limited number of high-impact projects each quarter.
        </p>

        <Link
          href="/contact"
          className="inline-block px-14 py-6 rounded-2xl
                     bg-linear-to-r from-[#24eda2] to-[#00a3f8]
                     font-semibold text-lg
                     hover:scale-105 transition duration-300
                     shadow-[0_20px_60px_rgba(36,237,162,0.35)]"
        >
          Apply to Work With Us
        </Link>
      </section>
    </main>
  );
}
