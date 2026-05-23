"use client";

import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useState, Suspense, useRef } from "react";
import SearchParamsSync from "../components/searchParamsSync";

export default function ContactPageClient({
  packageOptions,
}: {
  packageOptions: Record<string, string[]>;
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressScale = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    package: "",
    date: "",
    time: "",
    message: "",
  });

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const totalSteps = 3;

  const showError = (msg: string) => {
    setToast({ type: "error", message: msg });
    setTimeout(() => setToast(null), 3000);
  };

  const nextStep = () => {
    if (step === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.name || !emailRegex.test(formData.email)) {
        showError("Enter a valid name and professional email.");
        return;
      }
    }
    if (step === 2 && (!formData.service || !formData.package)) {
      showError("Select a service and package.");
      return;
    }
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "service") {
      setFormData((prev) => ({ ...prev, service: value, package: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      showError("Select a date and time.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          service: formData.service,
          package: formData.package,
          date: formData.date,
          time: formData.time,
          message: formData.message,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit");
      }
      setToast({
        type: "success",
        message: "Application received. We'll review and respond within 24 hours.",
      });
      setTimeout(() => {
        setToast(null);
        setStep(1);
        setFormData({ name: "", email: "", service: "", package: "", date: "", time: "", message: "" });
      }, 4000);
    } catch {
      showError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    return `${hour.toString().padStart(2, "0")}:${i % 2 ? "30" : "00"}`;
  });

  const stepLabels = ["About You", "Project", "Schedule"];

  return (
    <main ref={containerRef} className="bg-[#060606] text-white min-h-screen overflow-x-hidden relative">
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progressScale }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#24eda2] to-[#00a3f8] origin-left z-50"
      />

      <Suspense fallback={null}>
        <SearchParamsSync setFormData={setFormData} />
      </Suspense>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-xl text-[14px] font-semibold shadow-2xl ${
              toast.type === "success"
                ? "bg-[#24eda2] text-black"
                : "bg-red-500/90 text-white backdrop-blur-xl"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className="relative min-h-[75vh] flex items-center justify-center text-center px-6 overflow-hidden pt-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#24eda2]/[0.05] blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#00a3f8]/[0.04] blur-[100px]" />
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
              Apply to Work With Us
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[52px] md:text-[76px] font-black leading-[0.92] tracking-[-0.04em] mb-8"
          >
            Let&apos;s Build
            <br />
            Something
            <br />
            <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
              Unforgettable.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-[17px] text-white/40 max-w-lg mx-auto leading-relaxed tracking-[-0.01em]"
          >
            Authority. Presence. Revenue. Let&apos;s make the internet
            remember you.
          </motion.p>
        </div>
      </section>

      {/* ── FORM ── */}
      <section className="relative py-16 px-6 max-w-2xl mx-auto pb-40">
        {/* Step indicators */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            {stepLabels.map((label, i) => {
              const stepNum = i + 1;
              const isActive = step === stepNum;
              const isDone = step > stepNum;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                      isDone
                        ? "bg-[#24eda2] text-black"
                        : isActive
                        ? "bg-white text-black"
                        : "bg-white/[0.08] text-white/30"
                    }`}
                  >
                    {isDone ? "✓" : stepNum}
                  </div>
                  <span
                    className={`text-[12px] font-medium tracking-[-0.01em] transition-colors duration-300 ${
                      isActive ? "text-white" : isDone ? "text-[#24eda2]" : "text-white/25"
                    }`}
                  >
                    {label}
                  </span>
                  {i < stepLabels.length - 1 && (
                    <div className="flex-1 h-[1px] mx-3 hidden sm:block">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isDone ? "bg-[#24eda2]/40" : "bg-white/[0.08]"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full h-[1px] bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#24eda2] to-[#00a3f8]"
            />
          </div>
        </div>

        {/* Form card */}
        <div className="gradient-border rounded-2xl">
          <form
            onSubmit={handleSubmit}
            className="bg-[#0a0a0a] rounded-2xl p-8 md:p-10"
          >
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-3">
                    Step 01
                  </p>
                  <h2 className="text-[28px] md:text-[32px] font-black tracking-[-0.03em] mb-2">
                    Who are we working with?
                  </h2>
                  <p className="text-white/35 text-[14px] mb-8">
                    Tell us about yourself.
                  </p>

                  <div className="space-y-4">
                    <input
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-style"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-style"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="primary-btn mt-8 w-full"
                  >
                    Continue Application →
                  </button>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-3">
                    Step 02
                  </p>
                  <h2 className="text-[28px] md:text-[32px] font-black tracking-[-0.03em] mb-2">
                    What are we building?
                  </h2>
                  <p className="text-white/35 text-[14px] mb-8">
                    Select your service and preferred package.
                  </p>

                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="input-style select-dark mb-6"
                  >
                    <option value="">Select a Service</option>
                    <option value="custom-design">Custom Web Design</option>
                    <option value="ecommerce">E-commerce Website</option>
                    <option value="maintenance">Website Maintenance</option>
                    <option value="remodeling">Website Remodel</option>
                  </select>

                  {formData.service && packageOptions[formData.service] && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {packageOptions[formData.service].map((pkg) => (
                        <button
                          key={pkg}
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, package: pkg }))}
                          className={`package-btn ${formData.package === pkg ? "active-package" : ""}`}
                        >
                          {pkg}
                        </button>
                      ))}
                    </div>
                  )}

                  {formData.package === "Legacy Impact" && (
                    <p className="mt-4 text-[13px] text-[#24eda2]">
                      Excellent choice — our highest-tier transformation package.
                    </p>
                  )}

                  <p className="text-white/25 mt-6 text-[12px] tracking-[-0.01em]">
                    We accept a limited number of projects per month to maintain elite quality.
                  </p>

                  <div className="flex items-center justify-between mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="text-[13px] text-white/35 hover:text-white transition-colors"
                    >
                      ← Back
                    </button>
                    <button type="button" onClick={nextStep} className="primary-btn">
                      Review Details →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold mb-3">
                    Step 03
                  </p>
                  <h2 className="text-[28px] md:text-[32px] font-black tracking-[-0.03em] mb-2">
                    Let&apos;s lock it in.
                  </h2>
                  <p className="text-white/35 text-[14px] mb-8">
                    Choose a consultation date and time.
                  </p>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="input-style"
                  />

                  {formData.date && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4 max-h-52 overflow-y-auto pr-1">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, time: slot }))}
                          className={`time-btn ${formData.time === slot ? "active-package" : ""}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}

                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Anything else we should know? (optional)"
                    value={formData.message}
                    onChange={handleChange}
                    className="input-style mt-5"
                  />

                  <div className="flex items-center justify-between mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="text-[13px] text-white/35 hover:text-white transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="primary-btn disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          {[
            "Response within 24 hours",
            "No commitment required",
            "Limited spots available",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#24eda2]/60" />
              <span className="text-[12px] text-white/25 tracking-[-0.01em]">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
