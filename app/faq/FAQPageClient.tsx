"use client";

import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { useState, useRef } from "react";

type FAQItem = {
  q: string;
  a: React.ReactNode;
};

type FAQSection = {
  id: string;
  label: string;
  icon: string;
  items: FAQItem[];
};

const FAQ_SECTIONS: FAQSection[] = [
  {
    id: "payment",
    label: "Payment & Booking",
    icon: "💳",
    items: [
      {
        q: "How do I make a payment?",
        a: (
          <>
            We accept bank transfers via NCB Jamaica and Scotia Bank Jamaica. After your consultation
            is confirmed you'll receive a reference number — use that as your transfer description so
            we can match your payment instantly. Visit the{" "}
            <Link href="/payment" className="text-[#24eda2] hover:underline">
              Payment Portal
            </Link>{" "}
            and enter your reference number to see the exact amount and bank details.
          </>
        ),
      },
      {
        q: "Can I pay a deposit instead of the full amount upfront?",
        a: (
          <>
            Yes. You can pay a 50% deposit to secure your slot, with the remaining balance due on
            delivery. Head to the{" "}
            <Link href="/payment" className="text-[#24eda2] hover:underline">
              Payment Portal
            </Link>
            , look up your reference number, and choose "Pay 50% Deposit." We'll send you a
            confirmation email with the remaining balance details.
          </>
        ),
      },
      {
        q: "Where do I find my reference number?",
        a: (
          <>
            Your reference number (format: <span className="font-mono text-white">ED-XXXXXX</span>)
            is emailed to you immediately after you submit a consultation request. It's also shown on
            the success screen after you submit the{" "}
            <Link href="/contact" className="text-[#24eda2] hover:underline">
              booking form
            </Link>
            . Keep it safe — you'll need it to access the Payment Portal and track your project
            status.
          </>
        ),
      },
      {
        q: "Do you accept USD or other currencies?",
        a: "All bank transfers are processed in Jamaican Dollars (JMD). The Payment Portal and Packages page both have a JMD/USD toggle so you can see the approximate USD equivalent at the live exchange rate — but the actual bank transfer must be made in JMD.",
      },
      {
        q: "What happens after I pay?",
        a: "Once your transfer is made, visit the Payment Portal and click 'I've Completed My Transfer.' Your status will update and our team will verify the payment within 24 hours. You'll receive an email confirmation for every payment event — deposit, full payment, and final balance.",
      },
      {
        q: "How do I pay the remaining balance?",
        a: (
          <>
            When you're ready to clear the remaining 50%, return to the{" "}
            <Link href="/payment" className="text-[#24eda2] hover:underline">
              Payment Portal
            </Link>
            , look up your reference number, and you'll see a "Pay Remaining Balance" option with the
            bank details. Use your reference number as the transfer description — same as the
            deposit.
          </>
        ),
      },
    ],
  },
  {
    id: "getting-started",
    label: "Getting Started",
    icon: "🚀",
    items: [
      {
        q: "How do I get started?",
        a: (
          <>
            Book a free strategy call via our{" "}
            <Link href="/contact" className="text-[#24eda2] hover:underline">
              consultation form
            </Link>
            . Tell us your service type, preferred package, and goals — our team will reach out
            within 24 hours to confirm your slot and discuss next steps. There's no commitment at
            this stage.
          </>
        ),
      },
      {
        q: "How long does a project typically take?",
        a: (
          <>
            Timelines vary by service:
            <ul className="mt-3 space-y-1.5 list-none">
              {[
                ["Quick Start Websites", "3–7 business days"],
                ["Custom Web Design", "2–6 weeks"],
                ["Website Remodeling", "1–4 weeks"],
                ["Website Maintenance", "Ongoing — updates within 48 hours"],
              ].map(([service, time]) => (
                <li key={service} className="flex items-start gap-2.5">
                  <span className="text-[#24eda2] text-[12px] mt-0.5 shrink-0 font-bold">✓</span>
                  <span>
                    <span className="text-white font-semibold">{service}:</span>{" "}
                    <span className="text-white/60">{time}</span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        ),
      },
      {
        q: "Do I need to prepare anything before we start?",
        a: "Ideally yes — having your logo, brand colours, copy (text), and any images ready will speed up delivery significantly. If you don't have these yet, don't worry. We can guide you on what's needed and work with what you have. Custom design packages include a discovery session where we gather everything together.",
      },
      {
        q: "Will my website be mobile-friendly?",
        a: "Every website we build is fully responsive — designed and tested across mobile, tablet, and desktop screen sizes. Mobile performance is a first-class priority, not an afterthought.",
      },
      {
        q: "Can I see examples of your work before committing?",
        a: (
          <>
            Yes. Browse our{" "}
            <Link href="/projects" className="text-[#24eda2] hover:underline">
              Portfolio
            </Link>{" "}
            to see completed projects. During the strategy call we'll also walk you through relevant
            case studies that match your industry or goals.
          </>
        ),
      },
    ],
  },
  {
    id: "web-design",
    label: "Custom Web Design",
    icon: "🎨",
    items: [
      {
        q: "What's included in a custom web design package?",
        a: (
          <>
            Our custom design packages include strategy discovery, UI/UX design, full development,
            mobile responsiveness, SEO foundations, performance optimisation, and a launch-ready
            handoff. Exact features vary by tier — see the full breakdown on our{" "}
            <Link href="/packages" className="text-[#24eda2] hover:underline">
              Packages page
            </Link>
            .
          </>
        ),
      },
      {
        q: "Can I request changes after the site is live?",
        a: "Yes. Each package includes a revision round before launch. Post-launch changes can be handled through our maintenance plans, or quoted separately depending on scope. We always provide a project handoff so you own your site completely.",
      },
      {
        q: "Will I own my website after it's built?",
        a: "Absolutely. You receive full ownership of all code, assets, and content. There's no lock-in — you can host it anywhere, hand it to another developer, or manage it yourself. We build on open, portable technology.",
      },
      {
        q: "Do you build on platforms like WordPress or Webflow?",
        a: "We primarily build with Next.js and React for performance and scalability. We can work with WordPress or other CMS platforms where the project calls for it. Let us know your preferences during the strategy call.",
      },
      {
        q: "What if I don't have a design in mind?",
        a: "That's exactly what the strategy session is for. We'll walk through your goals, competitors, and audience to develop a design direction together. You'll see mockups before a single line of code is written.",
      },
    ],
  },
  {
    id: "remodeling",
    label: "Website Remodeling",
    icon: "🔨",
    items: [
      {
        q: "What's the difference between remodeling and building a new site?",
        a: "Remodeling means we redesign and rebuild your existing site — improving its look, speed, and structure — while preserving your brand, content, and any existing SEO value. A full new build starts from scratch. Remodeling is the right choice if your brand is solid but the execution needs upgrading.",
      },
      {
        q: "Will a remodel affect my Google rankings?",
        a: "When done correctly, a remodel can improve your rankings significantly. We preserve existing URL structures where possible, carry over metadata, and fix technical SEO issues during the process. We do not launch until the site passes our performance and SEO checklist.",
      },
      {
        q: "Do I need to provide my existing site's login details?",
        a: "We'll need access to whatever platform your current site runs on — WordPress admin, hosting panel, domain registrar, etc. We'll tell you exactly what's needed after the strategy call. You can revoke access once the project is complete.",
      },
      {
        q: "How long does a remodel take?",
        a: "Most remodels are completed in 1–4 weeks depending on complexity and how quickly content and feedback is provided. We'll give you a specific timeline after reviewing your current site.",
      },
    ],
  },
  {
    id: "maintenance",
    label: "Website Maintenance",
    icon: "🛠️",
    items: [
      {
        q: "What does a maintenance plan include?",
        a: (
          <>
            Maintenance plans cover ongoing content updates, plugin and dependency updates, security
            monitoring, uptime checks, and priority support. See the full list of what's included in
            each tier on the{" "}
            <Link href="/packages" className="text-[#24eda2] hover:underline">
              Packages page
            </Link>
            .
          </>
        ),
      },
      {
        q: "How quickly are maintenance requests handled?",
        a: "Standard updates are completed within 48 hours. Priority packages include same-day response for urgent issues. All requests are tracked so you can see the status at any time.",
      },
      {
        q: "What if my site goes down?",
        a: "Maintenance clients get priority emergency support. Contact us immediately via email and we'll diagnose and resolve downtime issues as fast as possible — usually within a few hours.",
      },
      {
        q: "Can I get maintenance even if you didn't build my site?",
        a: "Yes. We offer maintenance plans for any website regardless of who built it. We'll do a brief technical audit first to understand the stack and identify any existing issues before taking on the retainer.",
      },
      {
        q: "Is there a minimum contract term for maintenance?",
        a: "Maintenance plans are billed monthly with no lock-in. You can cancel anytime. We recommend a minimum of 3 months to see the full value of ongoing optimisation work.",
      },
    ],
  },
  {
    id: "quick-start",
    label: "Quick Start Websites",
    icon: "⚡",
    items: [
      {
        q: "What is a Quick Start website?",
        a: (
          <>
            Quick Start websites are professionally designed, fast-to-launch websites built from
            high-quality templates customised with your branding, content, and colours. They're ideal
            for new businesses that need an online presence quickly and affordably. Browse the options
            on our{" "}
            <Link href="/packages" className="text-[#24eda2] hover:underline">
              Packages page
            </Link>
            .
          </>
        ),
      },
      {
        q: "How fast can a Quick Start site go live?",
        a: "Most Quick Start websites are live within 3–7 business days once you've provided your content (logo, text, images). The faster you get us the content, the faster we launch.",
      },
      {
        q: "Can I upgrade to a custom design later?",
        a: "Yes. Your Quick Start site is fully yours — you can upgrade to a custom design at any time. We'll credit a portion of your Quick Start investment toward the new project.",
      },
      {
        q: "Do Quick Start sites include hosting?",
        a: "Deployment and initial setup are included. Ongoing hosting costs depend on the platform — we'll recommend the most cost-effective hosting for your needs and walk you through setup.",
      },
    ],
  },
  {
    id: "hosting",
    label: "Hosting & Domains",
    icon: "🌐",
    items: [
      {
        q: "Do you provide hosting?",
        a: "We don't sell hosting directly, but we handle full deployment and recommend the best hosting solution for your project — typically Vercel, Netlify, or a VPS provider depending on your stack and budget. We'll set everything up for you.",
      },
      {
        q: "Can I use my existing hosting provider?",
        a: "In most cases, yes. As long as your current host supports your site's technology stack, we can deploy there. If your host is incompatible or underperforming, we'll recommend a better option.",
      },
      {
        q: "Do you help with domain registration and DNS setup?",
        a: "Yes. We guide you through domain registration (or transfer) and handle all DNS configuration to point your domain to the live site. We'll stay on-hand until everything resolves correctly.",
      },
      {
        q: "What happens to my hosting after the project ends?",
        a: "Your hosting is in your name and under your control at all times. We never hold hosting on your behalf. When the project is complete, you have everything you need to manage it independently — or continue with a maintenance plan.",
      },
    ],
  },
];

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className={`rounded-xl border transition-colors duration-300 ${
            open === i ? "border-[#24eda2]/20 bg-[#24eda2]/[0.02]" : "border-white/[0.06] bg-white/[0.01]"
          }`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
          >
            <span
              className={`text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 ${
                open === i ? "text-white" : "text-white/70"
              }`}
            >
              {item.q}
            </span>
            <span
              className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] transition-all duration-300 ${
                open === i
                  ? "border-[#24eda2]/40 text-[#24eda2] rotate-45"
                  : "border-white/[0.12] text-white/30"
              }`}
            >
              +
            </span>
          </button>

          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 text-[14px] text-white/55 leading-relaxed border-t border-white/[0.04] pt-4">
                  {item.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function FAQPageClient() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressScale = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  return (
    <main ref={containerRef} className="bg-[#060606] text-white overflow-x-hidden relative">
      <motion.div
        style={{ scaleX: progressScale }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#24eda2] to-[#00a3f8] origin-left z-50"
      />

      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-center px-6 overflow-hidden pt-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#24eda2]/[0.04] blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#00a3f8]/[0.03] blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#24eda2] animate-pulse" />
            <span className="text-[11px] uppercase tracking-[3px] text-white/50 font-semibold">
              Help Centre
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[52px] md:text-[72px] font-black leading-[0.92] tracking-[-0.04em] mb-6"
          >
            Got Questions?
            <br />
            <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
              We've Got Answers.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-[17px] text-white/40 max-w-xl mx-auto leading-relaxed tracking-[-0.01em]"
          >
            Everything you need to know about our services, payment process, and what to expect
            working with Eccentric Digital.
          </motion.p>
        </div>
      </section>

      {/* ── HOW TO PAY (prominent) ── */}
      <section className="px-6 max-w-4xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-[#24eda2]/20 bg-gradient-to-br from-[#24eda2]/[0.05] to-[#00a3f8]/[0.05] p-8 md:p-10"
        >
          <div className="flex items-start gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#24eda2]/10 border border-[#24eda2]/20 flex items-center justify-center shrink-0 text-lg">
              💳
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[3px] text-[#24eda2]/70 font-semibold mb-1">
                Quick Guide
              </p>
              <h2 className="text-[26px] font-black tracking-[-0.03em]">How to Make a Payment</h2>
            </div>
          </div>

          <ol className="space-y-5">
            {[
              {
                step: "1",
                title: "Book a Consultation",
                desc: "Fill out the booking form and submit your consultation request.",
                link: { href: "/contact", label: "Book Now →" },
              },
              {
                step: "2",
                title: "Receive Your Reference Number",
                desc: "Check your email — your unique reference number (ED-XXXXXX) will be there immediately after submission.",
              },
              {
                step: "3",
                title: "Open the Payment Portal",
                desc: "Enter your reference number to see your booking details, amount due, and bank transfer instructions.",
                link: { href: "/payment", label: "Payment Portal →" },
              },
              {
                step: "4",
                title: "Transfer via NCB or Scotia Bank",
                desc: "Make a bank transfer to either of our accounts. Use your reference number as the transfer description so we can match your payment.",
              },
              {
                step: "5",
                title: "Confirm Your Transfer",
                desc: "Back in the Payment Portal, click 'I've Completed My Transfer.' We'll verify within 24 hours and send you a confirmation email.",
              },
            ].map(({ step, title, desc, link }) => (
              <li key={step} className="flex gap-5">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#24eda2] to-[#00a3f8] flex items-center justify-center text-black text-[13px] font-black">
                  {step}
                </div>
                <div className="pt-0.5">
                  <p className="text-[15px] font-semibold text-white mb-1">{title}</p>
                  <p className="text-[13px] text-white/45 leading-relaxed">
                    {desc}{" "}
                    {link && (
                      <Link
                        href={link.href}
                        className="text-[#24eda2] font-semibold hover:underline"
                      >
                        {link.label}
                      </Link>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>
      </section>

      {/* ── QUICK LINKS ── */}
      <section className="px-6 max-w-4xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-6">
            Jump To
          </p>
          <div className="flex flex-wrap gap-2">
            {FAQ_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[13px] font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? "border-[#24eda2]/40 bg-[#24eda2]/[0.06] text-[#24eda2]"
                    : "border-white/[0.06] text-white/50 hover:border-white/[0.12] hover:text-white/80"
                }`}
              >
                <span>{section.icon}</span>
                {section.label}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FAQ SECTIONS ── */}
      <section className="px-6 max-w-4xl mx-auto pb-32 space-y-20">
        {FAQ_SECTIONS.map((section, si) => (
          <motion.div
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: si * 0.05 }}
            style={{ scrollMarginTop: "100px" }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">{section.icon}</span>
              <div>
                <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-1">
                  FAQ
                </p>
                <h2 className="text-[28px] md:text-[34px] font-black tracking-[-0.03em] leading-none">
                  {section.label}
                </h2>
              </div>
            </div>
            <div className="h-[1px] bg-gradient-to-r from-[#24eda2]/20 to-transparent mb-8" />
            <FAQAccordion items={section.items} />
          </motion.div>
        ))}
      </section>

      {/* ── CTA ── */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#24eda2]/[0.04] blur-[100px]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-8">
              Still Have Questions?
            </p>
            <h2 className="text-[48px] md:text-[60px] font-black leading-[0.92] tracking-[-0.04em] mb-6">
              Let&apos;s Talk
              <br />
              <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
                It Through.
              </span>
            </h2>
            <p className="text-white/35 text-[16px] max-w-md mx-auto mb-12 leading-relaxed tracking-[-0.01em]">
              Book a free strategy call and we'll answer every question you have — no pressure, no
              sales pitch.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black font-bold text-[15px] tracking-[-0.02em] hover:shadow-[0_24px_80px_rgba(36,237,162,0.3)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Book a Free Call →
              </Link>
              <Link
                href="/payment"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-white/[0.08] text-white/60 font-semibold text-[15px] tracking-[-0.02em] hover:border-white/20 hover:text-white transition-all duration-300"
              >
                Payment Portal →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
