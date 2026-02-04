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
      "Tailored, high-impact websites crafted to reflect your brand’s identity and convert visitors into customers.",
    image: "/images/customwebsites.jpg",
    route: "/services/custom-web-design",
  },
  {
    title: "Website Remodeling",
    tags: ["Redesign", "Performance", "SEO"],
    description:
      "Transform outdated websites into modern, fast, and visually compelling digital experiences.",
    image: "/images/websiteremodeling.jpg",
    route: "/services/website-remodeling",
  },
  {
    title: "Website Maintenance",
    tags: ["Security", "Updates", "Support"],
    description:
      "We keep your website secure, optimized, and running smoothly so you can focus on your business.",
    image: "/images/websitemaintenance.jpg",
    route: "/services/website-maintenance",
  },
  {
    title: "Quick Start Websites",
    tags: ["Launch Fast", "Affordable", "Reliable"],
    description:
      "Professional websites launched quickly — perfect for startups and growing brands.",
    image: "/images/quicksite.jpg",
    route: "/services/quick-start-websites",
  },
];

/* ---------------- Magnetic Hook ---------------- */
const useMagnetic = () => {
  const rotateX = useSpring(0, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = (x - rect.width / 2) / rect.width;
    const dy = (y - rect.height / 2) / rect.height;

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
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const MagneticCard = ({ service }: { service: Service }) => {
  const { rotateX, rotateY, handleMouseMove, reset } = useMagnetic();

  return (
    <motion.div variants={cardVariants}>
      <Link
        href={service.route}
        aria-label={`View ${service.title} service`}
        className="block"
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={reset}
          style={{
            rotateX,
            rotateY,
            transformPerspective: 1000,
          }}
          whileHover={{ scale: 1.02 }}
          className="group relative rounded-xl overflow-hidden bg-white/10 backdrop-blur-md
                     border border-white/10 shadow-lg transition-all
                     hover:shadow-[0_0_40px_rgba(36,237,162,0.15)]"
        >
          <Image
            src={service.image}
            alt={service.title}
            width={600}
            height={400}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover w-full h-64 transition-transform duration-700 group-hover:scale-105"
          />

          <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-2 text-xs text-white/70">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-full bg-white/10 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="text-2xl font-semibold tracking-wide">
              {service.title}
            </h3>

            <p className="text-gray-300 leading-relaxed">
              {service.description}
            </p>

            <span
              className="inline-block mt-2 text-sm text-blue-400
                         opacity-0 group-hover:opacity-100
                         group-focus-within:opacity-100 transition"
            >
              View Service →
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
    <main className="bg-linear-to-br from-gray-900 via-black to-gray-800 text-white min-h-screen">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative h-[60vh] flex items-center justify-center overflow-hidden"
      >
        <motion.div style={{ y: yParallax }} className="absolute inset-0">
          <Image
            src="/images/backdrop.png"
            alt="Premium Services Hero"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />

        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9 }}
          className="relative z-10 text-center max-w-3xl px-6"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-[0_0_20px_rgba(36,237,162,0.4)]">
            Our Services
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300">
            Cinematic, glassmorphic digital experiences built to elevate modern
            brands.
          </p>
        </motion.div>
      </section>

      {/* Services */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[28pt] font-bold text-center mb-16 tracking-wide"
        >
          What We Offer
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-2 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {services.map((service) => (
            <MagneticCard key={service.title} service={service} />
          ))}
        </motion.div>
      </section>

      {/* Trust */}
      <section className="py-20 text-center text-gray-300">
        <p className="text-lg">
          Trusted by <span className="text-white font-semibold">50+</span>{" "}
          brands · <span className="text-white font-semibold">4+ years</span>{" "}
          experience · <span className="text-white font-semibold">99.9%</span>{" "}
          uptime
        </p>
      </section>

      {/* CTA */}
      <section className="py-24 bg-linear-to-tr from-gray-900 via-black to-gray-800 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold mb-6"
        >
          Let’s Build Something Better
        </motion.h2>

        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
          Book a free strategy call and discover how we can elevate your digital
          presence.
        </p>

        <Link
          href="/contact"
          className="inline-block px-10 py-4 rounded-xl bg-linear-to-r
                     from-[#24eda2] to-[#00a3f8] text-white font-semibold
                     shadow-lg hover:scale-105 transition"
        >
          Book a Free Strategy Call
        </Link>
      </section>
    </main>
  );
}
