"use client";

import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useState, useEffect, Suspense, useRef } from "react";
import SearchParamsSync from "../components/searchParamsSync";

export default function ContactPageClient({
  packageOptions,
  packagePrices,
}: {
  packageOptions: Record<string, string[]>;
  packagePrices: Record<string, string>;
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressScale = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    service: "",
    package: "",
    price: "",
    date: "",
    time: "",
    message: "",
    clientType: "new" as "new" | "existing",
    existingRef: "",
  });

  const [existingRefState, setExistingRefState] = useState<{
    loading: boolean;
    valid: boolean | null;
    clientName?: string;
  }>({ loading: false, valid: null });

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const totalSteps = 3;

  const showError = (msg: string) => {
    setToast({ type: "error", message: msg });
    setTimeout(() => setToast(null), 3000);
  };

  const applyDiscount = (price: string, pct: number): string => {
    const num = parseFloat(price.replace(/[^0-9.]/g, ""));
    if (!num) return price;
    const discounted = Math.round(num * (1 - pct / 100));
    return "$" + discounted.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  const validateExistingRef = async () => {
    const ref = formData.existingRef.trim().toUpperCase();
    if (!ref) return;
    setExistingRefState({ loading: true, valid: null });
    try {
      const res = await fetch(`/api/maintenance/validate?ref=${encodeURIComponent(ref)}`);
      const data = await res.json();
      if (data.valid) {
        setExistingRefState({ loading: false, valid: true, clientName: data.name });
      } else {
        setExistingRefState({ loading: false, valid: false });
      }
    } catch {
      setExistingRefState({ loading: false, valid: false });
    }
  };

  const nextStep = () => {
    if (step === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.name || !emailRegex.test(formData.email)) {
        showError("Enter a valid name and professional email.");
        return;
      }
      if (!formData.phone || formData.phone.replace(/\D/g, "").length < 7) {
        showError("Enter a valid phone number.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.service || !formData.package) {
        showError("Select a service and package.");
        return;
      }
      if (formData.service === "maintenance" && formData.clientType === "existing" && !existingRefState.valid) {
        showError("Please verify your existing reference number first.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "service") {
      setFormData((prev) => ({ ...prev, service: value, package: "", clientType: "new", existingRef: "" }));
      setExistingRefState({ loading: false, valid: null });
    } else if (name === "phone") {
      setFormData((prev) => ({ ...prev, phone: value.replace(/[^\d+\-\s()]/g, "") }));
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
          businessName: formData.businessName,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          package: formData.package,
          price: formData.price,
          date: formData.date,
          time: formData.time,
          message: formData.message,
          clientType: formData.clientType,
          existingRef: formData.existingRef || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit");
      }
      const data = await res.json();
      const isMaintenance = data.type === "maintenance";
      setToast({
        type: "success",
        message: isMaintenance
          ? `Subscription confirmed! Ref: ${data.referenceNumber}. Check your email.`
          : `Application received! Ref: ${data.referenceNumber}. Check your email for details.`,
      });
      setTimeout(() => {
        setToast(null);
        setStep(1);
        setFormData({ name: "", businessName: "", email: "", phone: "", service: "", package: "", price: "", date: "", time: "", message: "", clientType: "new", existingRef: "" });
        setExistingRefState({ loading: false, valid: null });
      }, 4000);
    } catch {
      showError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots: string[] = [];
  for (let mins = 8 * 60; mins <= 17 * 60; mins += 30) {
    const h24 = Math.floor(mins / 60);
    const m = mins % 60;
    const period = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 > 12 ? h24 - 12 : h24 === 0 ? 12 : h24;
    timeSlots.push(`${h12}:${m === 0 ? "00" : "30"} ${period}`);
  }

  // Auto-fill price when package is pre-selected via URL params
  useEffect(() => {
    if (formData.package && !formData.price && packagePrices[formData.package]) {
      setFormData((prev) => ({ ...prev, price: packagePrices[formData.package] }));
    }
  }, [formData.package, formData.price, packagePrices]);

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
                      name="businessName"
                      placeholder="Business Name (optional)"
                      value={formData.businessName}
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
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      inputMode="numeric"
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

                  {/* ── Maintenance: New / Existing client toggle ── */}
                  {formData.service === "maintenance" && (
                    <div className="mb-6">
                      <p className="text-[11px] uppercase tracking-[3px] text-white/25 font-semibold mb-3">I am a…</p>
                      <div className="grid grid-cols-2 gap-2 mb-5">
                        {(["new", "existing"] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setFormData((p) => ({ ...p, clientType: type, existingRef: "", package: "" }));
                              setExistingRefState({ loading: false, valid: null });
                            }}
                            className={`py-3 rounded-xl text-[13px] font-semibold transition-all border ${
                              formData.clientType === type
                                ? "bg-[#24eda2]/10 border-[#24eda2]/30 text-[#24eda2]"
                                : "border-white/[0.08] text-white/40 hover:text-white hover:border-white/20"
                            }`}
                          >
                            {type === "new" ? "New Subscriber" : "Existing Client"}
                          </button>
                        ))}
                      </div>

                      {/* Existing client ref input */}
                      {formData.clientType === "existing" && (
                        <div className="space-y-3 mb-5">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={formData.existingRef}
                              onChange={(e) => {
                                const val = e.target.value.toUpperCase();
                                setFormData((p) => ({ ...p, existingRef: val }));
                                setExistingRefState({ loading: false, valid: null });
                              }}
                              placeholder="Your reference (ED-XXXXXX or MNT-XXXXXXXX)"
                              className="input-style flex-1 font-mono tracking-wider"
                            />
                            <button
                              type="button"
                              onClick={validateExistingRef}
                              disabled={!formData.existingRef.trim() || existingRefState.loading}
                              className="px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 text-[13px] hover:border-[#24eda2]/30 hover:text-[#24eda2] transition-all disabled:opacity-40 whitespace-nowrap"
                            >
                              {existingRefState.loading ? "…" : "Verify →"}
                            </button>
                          </div>

                          {existingRefState.valid === true && (
                            <motion.div
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#24eda2]/[0.08] border border-[#24eda2]/20"
                            >
                              <span className="text-[#24eda2] font-bold text-lg">✓</span>
                              <div>
                                <p className="text-[13px] font-semibold text-[#24eda2]">Welcome back, {existingRefState.clientName}!</p>
                                <p className="text-[12px] text-[#24eda2]/60">10% loyalty discount will be applied to your subscription.</p>
                              </div>
                            </motion.div>
                          )}

                          {existingRefState.valid === false && (
                            <motion.div
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/20"
                            >
                              <span className="text-red-400 font-bold">✕</span>
                              <p className="text-[13px] text-red-400">Reference not found. Please check and try again.</p>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Package grid */}
                  {formData.service && packageOptions[formData.service] && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {packageOptions[formData.service].map((pkg) => {
                        const basePrice = packagePrices[pkg] ?? "";
                        const isExistingMaint = formData.service === "maintenance" && formData.clientType === "existing" && existingRefState.valid;
                        const displayPrice = isExistingMaint ? applyDiscount(basePrice, 10) : basePrice;
                        return (
                          <button
                            key={pkg}
                            type="button"
                            onClick={() =>
                              setFormData((p) => ({
                                ...p,
                                package: pkg,
                                price: isExistingMaint ? applyDiscount(basePrice, 10) : basePrice,
                              }))
                            }
                            className={`package-btn ${formData.package === pkg ? "active-package" : ""}`}
                          >
                            <span className="block">{pkg}</span>
                            {basePrice && (
                              <span className="block text-[11px] mt-1 opacity-70">
                                {isExistingMaint && (
                                  <span className="line-through mr-1.5 opacity-50">{basePrice}</span>
                                )}
                                <span className={isExistingMaint ? "text-[#24eda2]" : ""}>{displayPrice}</span>
                                {formData.service === "maintenance" && <span className="ml-1">/mo</span>}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {formData.package === "Legacy Impact" && (
                    <p className="mt-4 text-[13px] text-[#24eda2]">
                      Excellent choice — our highest-tier transformation package.
                    </p>
                  )}

                  <p className="text-white/25 mt-6 text-[12px] tracking-[-0.01em]">
                    {formData.service === "maintenance"
                      ? "Subscriptions renew monthly. Cancel or upgrade anytime."
                      : "We accept a limited number of projects per month to maintain elite quality."}
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
