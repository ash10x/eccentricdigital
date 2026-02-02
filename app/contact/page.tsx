"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect, Suspense } from "react";
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
    transition={{ duration: 0.8, delay }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

export default function ContactPage() {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, -120]);

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

  /* ---------------- SERVICE SYNC ---------------- */

  /* ---------------- CALENDLY-STYLE LOGIC ---------------- */
  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    return `${hour.toString().padStart(2, "0")}:${i % 2 ? "30" : "00"}`;
  });

  const isWeekend = (date: string) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setToast({
      type: "success",
      message:
        "Request sent! We’ll reach out shortly to confirm your consultation.",
    });

    setTimeout(() => setToast(null), 4000);
  };

  /* ---------------- PACKAGE OPTIONS ---------------- */
  const packageOptions: Record<string, string[]> = {
    "custom-design": ["Business Professional", "Legacy Impact"],
    ecommerce: ["E-commerce & Engagement", "Legacy Impact"],
    maintenance: ["Monthly Maintenance"],
    remodeling: ["Website Remodel"],
  };

  return (
    <main className="bg-linear-to-br from-gray-900 via-black to-gray-800 text-white min-h-screen overflow-hidden">
      {/* ---------------- SYNC URL PARAMS ---------------- */}
      <Suspense fallback={null}>
        <SearchParamsSync setFormData={setFormData} />
      </Suspense>

      {/* ---------------- TOAST ---------------- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-6 py-4 rounded-xl backdrop-blur-xl bg-[#24eda2]/90 text-black border border-[#24eda2]"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- HERO ---------------- */}
      <section
        ref={ref}
        className="relative h-[60vh] flex items-center justify-center"
      >
        <motion.div style={{ y: yParallax }} className="absolute inset-0">
          <Image
            src="/images/backdrop.png"
            alt="Contact"
            fill
            priority
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/70" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-5xl font-extrabold mb-4">Let’s Talk</h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            Book a consultation and let’s bring your digital vision to life.
          </p>
        </motion.div>
      </section>

      {/* ---------------- FORM ---------------- */}
      <section className="py-20 max-w-3xl mx-auto px-4">
        <FadeInUp>
          <div className="bg-black/70 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <div className="relative z-10 text-center px-4 mb-5">
              <h1 className="text-3xl font-extrabold mb-4">
                Secure Your Spot for a Custom Website That Converts
              </h1>
              <p className="text-sm text-green-400 max-w-xl mx-auto">
                Select your service, choose a package, and schedule a
                consultation — we’ll craft a website that grows your brand and
                drives results.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {["name", "email"].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field === "name" ? "Your Name" : "Your Email"}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20
                  focus:border-[#24eda2] focus:ring-1 focus:ring-[#24eda2] outline-none transition"
                />
              ))}

              {/* SERVICE */}
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20
                focus:border-[#24eda2] focus:ring-1 focus:ring-[#24eda2] outline-none transition"
              >
                <option value="">Select a Service</option>
                <option value="custom-design">Custom Web Design</option>
                <option value="ecommerce">E-commerce Website</option>
                <option value="maintenance">Website Maintenance</option>
                <option value="remodeling">Website Remodeling</option>
              </select>

              {/* PACKAGE SELECTION */}
              {formData.service && packageOptions[formData.service] && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">Choose a package</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {packageOptions[formData.service].map((pkg) => (
                      <button
                        key={pkg}
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({ ...p, package: pkg }))
                        }
                        className={`py-3 rounded-lg border text-sm transition ${
                          formData.package === pkg
                            ? "bg-[#24eda2] text-black border-[#24eda2]"
                            : "border-white/20 hover:border-[#24eda2]"
                        }`}
                      >
                        {pkg}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* DATE */}
              <input
                type="date"
                name="date"
                min={new Date().toISOString().split("T")[0]}
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20
                focus:border-[#24eda2] focus:ring-1 focus:ring-[#24eda2] outline-none transition"
              />

              {/* TIME SLOTS */}
              {formData.date && !isWeekend(formData.date) && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, time: slot }))}
                      className={`py-2 rounded-lg border text-sm ${
                        formData.time === slot
                          ? "bg-[#24eda2] text-black border-[#24eda2]"
                          : "border-white/20 hover:border-[#24eda2]"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}

              <textarea
                name="message"
                rows={5}
                placeholder="Tell us about your project (optional)"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20
                focus:border-[#24eda2] focus:ring-1 focus:ring-[#24eda2] outline-none transition"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-linear-to-r from-[#24eda2] to-[#00a3f8] text-black font-semibold"
              >
                Send Request
              </button>
            </form>
          </div>
        </FadeInUp>
      </section>
    </main>
  );
}
