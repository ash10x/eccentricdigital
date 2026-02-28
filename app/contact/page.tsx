"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, Suspense } from "react";
import SearchParamsSync from "../components/searchParamsSync";

/* ---------------- Fade Wrapper ---------------- */
const FadeInUp = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

export default function ContactPage() {
  const [step, setStep] = useState(1);

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "service") {
      setFormData((prev) => ({
        ...prev,
        service: value,
        package: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.time) {
      showError("Select a date and time.");
      return;
    }

    setToast({
      type: "success",
      message:
        "Application received. We’ll review and respond within 24 hours.",
    });

    setTimeout(() => {
      setToast(null);
      setStep(1);
      setFormData({
        name: "",
        email: "",
        service: "",
        package: "",
        date: "",
        time: "",
        message: "",
      });
    }, 4000);
  };

  const packageOptions: Record<string, string[]> = {
    "custom-design": ["Business Professional", "Legacy Impact"],
    ecommerce: ["E-commerce & Engagement", "Legacy Impact"],
    maintenance: ["Monthly Maintenance"],
    remodeling: ["Website Remodel"],
  };

  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    return `${hour.toString().padStart(2, "0")}:${i % 2 ? "30" : "00"}`;
  });

  return (
    <main className="bg-black text-white min-h-screen overflow-hidden relative">
      <Suspense fallback={null}>
        <SearchParamsSync setFormData={setFormData} />
      </Suspense>

      {/* ---------- TOAST ---------- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl font-semibold shadow-2xl ${
              toast.type === "success"
                ? "bg-[#24eda2] text-black"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- HERO ---------- */}
      <section className="relative h-[75vh] flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-linear-to-br from-black via-gray-900 to-black" />
        <div className="absolute -top-40 -left-40 w-150 h-150 bg-[#24eda2]/20 rounded-full blur-[180px]" />
        <div className="absolute -bottom-40 -right-40 w-150 h-150 bg-[#00a3f8]/20 rounded-full blur-[180px]" />

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold leading-tight">
            Let’s Build Something{" "}
            <span className="bg-linear-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
              Unforgettable
            </span>
          </h1>

          <p className="mt-6 text-md text-gray-300">
            Authority. Presence. Revenue. Let’s make the internet remember you.
          </p>

          <p className="mt-4 text-sm text-gray-500">
            Strategy-led. Conversion-focused. Built to scale.
          </p>
        </div>
      </section>

      {/* ---------- FORM ---------- */}
      <section className="relative py-24 px-6 max-w-3xl mx-auto">
        {/* Step Labels */}
        <div className="flex justify-between text-xs text-gray-400 mb-3 uppercase tracking-wider">
          <span className={step >= 1 ? "text-[#24eda2]" : ""}>About You</span>
          <span className={step >= 2 ? "text-[#24eda2]" : ""}>Project</span>
          <span className={step >= 3 ? "text-[#24eda2]" : ""}>Schedule</span>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              className="h-full bg-linear-to-r from-[#24eda2] to-[#00a3f8]"
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative bg-linear-to-br from-white/4 to-white/8 border border-white/10 backdrop-blur-3xl rounded-[28px] p-8 md:p-10 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
        >
          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  First — who are we working with?
                </h2>

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

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={nextStep}
                  className="primary-btn mt-8"
                >
                  Continue Application →
                </motion.button>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  What are we building?
                </h2>

                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="input-style select-dark"
                >
                  <option value="" className="option-dark">
                    Select a Service
                  </option>
                  <option value="custom-design" className="option-dark">
                    Custom Web Design
                  </option>
                  <option value="ecommerce" className="option-dark">
                    E-commerce Website
                  </option>
                  <option value="maintenance" className="option-dark">
                    Website Maintenance
                  </option>
                  <option value="remodeling" className="option-dark">
                    Website Remodel
                  </option>
                </select>

                {formData.service && packageOptions[formData.service] && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {packageOptions[formData.service].map((pkg) => (
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        key={pkg}
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({ ...p, package: pkg }))
                        }
                        className={`package-btn ${
                          formData.package === pkg && "active-package"
                        }`}
                      >
                        {pkg}
                      </motion.button>
                    ))}
                  </div>
                )}

                {formData.package === "Legacy Impact" && (
                  <p className="mt-4 text-sm text-[#24eda2]">
                    Excellent choice. This is our highest-tier transformation
                    package.
                  </p>
                )}

                <p className="text-gray-400 mt-6 text-sm">
                  We accept a limited number of projects per month to maintain
                  elite quality.
                </p>

                <div className="flex justify-between mt-8">
                  <button type="button" onClick={prevStep}>
                    ← Back
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={nextStep}
                    className="primary-btn"
                  >
                    Review Details →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Let’s lock it in.
                </h2>

                <p className="text-gray-400 mb-6 text-sm">
                  Choose a consultation time below.
                </p>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input-style"
                />

                {formData.date && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 max-h-56 overflow-y-auto pr-2">
                    {timeSlots.map((slot) => (
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        key={slot}
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({ ...p, time: slot }))
                        }
                        className={`time-btn ${
                          formData.time === slot && "active-package"
                        }`}
                      >
                        {slot}
                      </motion.button>
                    ))}
                  </div>
                )}

                <textarea
                  name="message"
                  rows={4}
                  placeholder="Anything else we should know?"
                  value={formData.message}
                  onChange={handleChange}
                  className="input-style mt-6"
                />

                <div className="flex justify-between mt-8">
                  <button type="button" onClick={prevStep}>
                    ← Back
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    className="primary-btn"
                  >
                    Submit Application
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </section>
    </main>
  );
}
