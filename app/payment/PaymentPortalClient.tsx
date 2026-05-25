"use client";

import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { BANK_DETAILS } from "@/lib/bankDetails";

type PaymentStatus = "unpaid" | "deposit_paid" | "fully_paid";
type Currency = "JMD" | "USD";

type BookingDetails = {
  referenceNumber: string;
  name: string;
  service: string;
  selectedPackage: string;
  price: string;
  preferredDate: string;
  preferredTime: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
};

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; description: string; dot: string; badge: string; text: string }
> = {
  unpaid: {
    label: "Unpaid",
    description: "No payment has been received yet.",
    dot: "bg-red-400",
    badge: "bg-red-500/10 border-red-500/20",
    text: "text-red-400",
  },
  deposit_paid: {
    label: "Deposit Paid",
    description: "50% deposit received. Remaining balance is due on delivery.",
    dot: "bg-amber-400",
    badge: "bg-amber-500/10 border-amber-500/20",
    text: "text-amber-400",
  },
  fully_paid: {
    label: "Fully Paid",
    description: "Payment complete. Your project is confirmed.",
    dot: "bg-[#24eda2]",
    badge: "bg-[#24eda2]/10 border-[#24eda2]/20",
    text: "text-[#24eda2]",
  },
};

function parseJmdAmount(price: string): number {
  return parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
}

function formatAmount(jmd: number, currency: Currency, rate: number | null): string {
  if (currency === "USD" && rate) {
    const usd = jmd / rate;
    return "$" + usd.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  return "$" + jmd.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function BankDetailsPanel({
  amount,
  jmdAmount,
  amountLabel,
  currency,
  rate,
  referenceNumber,
  onConfirm,
  confirming,
  confirmLabel,
}: {
  amount: string;
  jmdAmount: number;
  amountLabel: string;
  currency: Currency;
  rate: number | null;
  referenceNumber: string;
  onConfirm: () => void;
  confirming: boolean;
  confirmLabel: string;
}) {
  const jmdDisplay = "$" + jmdAmount.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      {/* Amount to transfer */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 text-center">
        <p className="text-[10px] uppercase tracking-[3px] text-white/25 font-semibold mb-2">{amountLabel}</p>
        <motion.p
          key={`${amount}-${currency}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-[36px] font-black tracking-[-0.03em] bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent leading-none"
        >
          {amount}
        </motion.p>
        <p className="text-[12px] text-white/25 mt-1 font-medium">{currency}</p>

        {/* JMD note when USD is selected */}
        {currency === "USD" && rate && (
          <p className="text-[11px] text-amber-400/70 mt-2">
            ≈ {jmdDisplay} JMD — bank accounts receive JMD
          </p>
        )}
      </div>

      {/* Transfer instructions */}
      <div className="rounded-xl border border-[#24eda2]/15 bg-[#24eda2]/[0.03] p-4">
        <p className="text-[11px] text-[#24eda2]/80 font-semibold mb-1">Transfer Description / Reference</p>
        <p className="text-[15px] font-mono font-bold text-white tracking-[2px]">{referenceNumber}</p>
        <p className="text-[11px] text-white/25 mt-1">Use this as the payment description when making your transfer</p>
      </div>

      {/* Bank details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BANK_DETAILS.map((bank) => (
          <div key={bank.bank} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-[10px] uppercase tracking-[2.5px] text-[#24eda2]/70 font-bold mb-3">{bank.bank}</p>
            <div className="space-y-2">
              {[
                { label: "Account Name", value: bank.accountName },
                { label: "Account No.", value: bank.accountNumber },
                { label: "Branch", value: bank.branch },
                { label: "Account Type", value: bank.accountType },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-baseline gap-2">
                  <span className="text-[11px] text-white/30 shrink-0">{label}</span>
                  <span className="text-[12px] text-white font-semibold text-right font-mono">{value}</span>
                </div>
              ))}
            </div>

            {bank.wire && (
              <>
                <div className="my-3 h-[1px] bg-white/[0.06]" />
                <p className="text-[9px] uppercase tracking-[2px] text-[#00a3f8]/60 font-bold mb-2">International Wire</p>
                <div className="space-y-2">
                  {[
                    { label: "SWIFT / BIC", value: bank.wire.swiftCode },
                    { label: "Bank Address", value: bank.wire.bankAddress },
                    ...(bank.wire.correspondentBank ? [{ label: "Correspondent Bank", value: bank.wire.correspondentBank }] : []),
                    ...(bank.wire.correspondentSwift ? [{ label: "Correspondent SWIFT", value: bank.wire.correspondentSwift }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-white/25">{label}</span>
                      <span className="text-[11px] text-white/70 font-medium font-mono leading-snug">{value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Confirm button */}
      <button
        onClick={onConfirm}
        disabled={confirming}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black font-bold text-[14px] tracking-[-0.01em] hover:shadow-[0_16px_48px_rgba(36,237,162,0.25)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {confirming ? "Confirming…" : confirmLabel}
      </button>

      <p className="text-[11px] text-white/15 text-center">
        Only click after your transfer is complete. Our team will verify and update your status within 24 hours.
      </p>
    </div>
  );
}

function CurrencyToggle({
  currency,
  setCurrency,
  rate,
  rateFallback,
}: {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rate: number | null;
  rateFallback: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold">Payment Options</p>
      <div className="flex flex-col items-end gap-1">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          {(["JMD", "USD"] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-bold tracking-[1.5px] uppercase transition-all duration-200 ${
                currency === c
                  ? "bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black shadow-[0_4px_16px_rgba(36,237,162,0.2)]"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        {rate !== null && (
          <p className="text-[10px] text-white/15 tracking-[0.3px]">
            {rateFallback ? "~" : ""}1 USD ≈ {rate.toLocaleString("en-US", { maximumFractionDigits: 2 })} JMD
          </p>
        )}
      </div>
    </div>
  );
}

export default function PaymentPortalClient() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressScale = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState<PaymentStatus | null>(null);
  const [selectedOption, setSelectedOption] = useState<"full" | "deposit" | null>(null);

  const [currency, setCurrency] = useState<Currency>("JMD");
  const [rate, setRate] = useState<number | null>(null);
  const [rateFallback, setRateFallback] = useState(false);

  useEffect(() => {
    fetch("/api/exchange-rate")
      .then((r) => r.json())
      .then((data) => {
        if (data.rate) {
          setRate(data.rate);
          setRateFallback(!!data.fallback);
        }
      })
      .catch(() => { setRate(157); setRateFallback(true); });
  }, []);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = ref.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setBooking(null);
    setSelectedOption(null);
    try {
      const res = await fetch(`/api/payment?ref=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setBooking(data);
      }
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (newStatus: PaymentStatus) => {
    if (!booking) return;
    setPaymentLoading(newStatus);
    try {
      const res = await fetch("/api/payment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceNumber: booking.referenceNumber, paymentStatus: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setBooking((prev) => prev ? { ...prev, paymentStatus: data.paymentStatus } : prev);
        setSelectedOption(null);
      }
    } catch {
      // silent
    } finally {
      setPaymentLoading(null);
    }
  };

  const jmdTotal = booking ? parseJmdAmount(booking.price) : 0;
  const jmdDeposit = Math.round(jmdTotal * 0.5);
  const status = booking ? STATUS_CONFIG[booking.paymentStatus] : null;

  const fmt = (jmd: number) => formatAmount(jmd, currency, rate);

  return (
    <main ref={containerRef} className="bg-[#060606] text-white min-h-screen overflow-x-hidden relative">
      <motion.div
        style={{ scaleX: progressScale }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#24eda2] to-[#00a3f8] origin-left z-50"
      />

      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-center px-6 overflow-hidden pt-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#24eda2]/[0.05] blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#00a3f8]/[0.04] blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#24eda2] animate-pulse" />
            <span className="text-[11px] uppercase tracking-[3px] text-white/50 font-semibold">Payment Portal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[48px] md:text-[64px] font-black leading-[0.92] tracking-[-0.04em] mb-6"
          >
            Complete Your
            <br />
            <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">Booking.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-[16px] text-white/40 max-w-md mx-auto leading-relaxed tracking-[-0.01em] mb-10"
          >
            Enter your reference number to view your booking details and bank transfer instructions.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            onSubmit={handleLookup}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="text"
              value={ref}
              onChange={(e) => setRef(e.target.value.toUpperCase())}
              placeholder="ED-XXXXXX"
              maxLength={9}
              spellCheck={false}
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/20 text-[15px] font-mono tracking-[2px] focus:outline-none focus:border-[#24eda2]/40 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !ref.trim()}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black font-bold text-[14px] tracking-[-0.01em] hover:shadow-[0_16px_48px_rgba(36,237,162,0.3)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none whitespace-nowrap"
            >
              {loading ? "Looking up…" : "Look Up →"}
            </button>
          </motion.form>
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section className="px-6 max-w-2xl mx-auto pb-40">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-5 rounded-xl bg-red-500/10 border border-red-500/20 text-center"
            >
              <p className="text-[14px] text-red-400">{error}</p>
            </motion.div>
          )}

          {booking && status && (
            <motion.div
              key="booking"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="mt-8 space-y-5"
            >
              {/* Reference + status */}
              <div className="gradient-border rounded-2xl">
                <div className="bg-[#0a0a0a] rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[3px] text-white/20 font-semibold mb-2">Reference Number</p>
                      <p className="text-[28px] font-black tracking-[3px] font-mono bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">
                        {booking.referenceNumber}
                      </p>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={booking.paymentStatus}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[12px] font-semibold shrink-0 ${status.badge} ${status.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${booking.paymentStatus !== "unpaid" ? "animate-pulse" : ""}`} />
                        {status.label}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <p className={`text-[12px] mt-3 ${status.text} opacity-70`}>{status.description}</p>
                </div>
              </div>

              {/* Booking summary */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
                  <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold">Booking Summary</p>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {[
                    { label: "Client", value: booking.name },
                    { label: "Service", value: booking.service },
                    { label: "Package", value: booking.selectedPackage },
                    { label: "Preferred Date", value: formatDate(booking.preferredDate) },
                    { label: "Preferred Time", value: booking.preferredTime },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between px-6 py-4 gap-4">
                      <span className="text-[12px] text-white/30 shrink-0">{label}</span>
                      <span className="text-[14px] text-white font-semibold text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment section */}
              {jmdTotal > 0 && booking.paymentStatus !== "fully_paid" && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                  <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
                    <CurrencyToggle
                      currency={currency}
                      setCurrency={setCurrency}
                      rate={rate}
                      rateFallback={rateFallback}
                    />
                  </div>

                  <div className="p-6">
                    <AnimatePresence mode="wait">

                      {/* UNPAID — choose */}
                      {booking.paymentStatus === "unpaid" && selectedOption === null && (
                        <motion.div
                          key="options"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="space-y-3"
                        >
                          <button
                            onClick={() => setSelectedOption("full")}
                            className="w-full gradient-border rounded-xl text-left"
                          >
                            <div className="bg-[#0a0a0a] rounded-xl p-5 hover:bg-[#0f0f0f] transition-colors">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-[12px] text-white/40 mb-1">Pay in Full</p>
                                  <motion.p
                                    key={`full-${currency}`}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-[26px] font-black tracking-[-0.03em] bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent"
                                  >
                                    {fmt(jmdTotal)}
                                    <span className="text-[12px] text-white/30 font-semibold ml-1.5">{currency}</span>
                                  </motion.p>
                                  <p className="text-[11px] text-white/20 mt-1">One-time · Full project access</p>
                                </div>
                                <span className="text-white/30 text-lg">→</span>
                              </div>
                            </div>
                          </button>

                          <button
                            onClick={() => setSelectedOption("deposit")}
                            className="w-full rounded-xl border border-white/[0.08] p-5 text-left hover:border-white/[0.14] hover:bg-white/[0.02] transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[12px] text-white/40 mb-1">Pay 50% Deposit</p>
                                <motion.p
                                  key={`deposit-${currency}`}
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="text-[26px] font-black tracking-[-0.03em] text-white"
                                >
                                  {fmt(jmdDeposit)}
                                  <span className="text-[12px] text-white/30 font-semibold ml-1.5">{currency}</span>
                                </motion.p>
                                <p className="text-[11px] text-white/20 mt-1">Secures your slot · Balance due on delivery</p>
                              </div>
                              <span className="text-white/30 text-lg">→</span>
                            </div>
                          </button>
                        </motion.div>
                      )}

                      {/* UNPAID — full selected */}
                      {booking.paymentStatus === "unpaid" && selectedOption === "full" && (
                        <motion.div
                          key="full-transfer"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                        >
                          <button
                            onClick={() => setSelectedOption(null)}
                            className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors mb-4"
                          >
                            ← Back to options
                          </button>
                          <BankDetailsPanel
                            amount={fmt(jmdTotal)}
                            jmdAmount={jmdTotal}
                            amountLabel="Full Payment Amount"
                            currency={currency}
                            rate={rate}
                            referenceNumber={booking.referenceNumber}
                            onConfirm={() => handleConfirmPayment("fully_paid")}
                            confirming={paymentLoading === "fully_paid"}
                            confirmLabel="I've Completed My Transfer →"
                          />
                        </motion.div>
                      )}

                      {/* UNPAID — deposit selected */}
                      {booking.paymentStatus === "unpaid" && selectedOption === "deposit" && (
                        <motion.div
                          key="deposit-transfer"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                        >
                          <button
                            onClick={() => setSelectedOption(null)}
                            className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors mb-4"
                          >
                            ← Back to options
                          </button>
                          <BankDetailsPanel
                            amount={fmt(jmdDeposit)}
                            jmdAmount={jmdDeposit}
                            amountLabel="Deposit Amount (50%)"
                            currency={currency}
                            rate={rate}
                            referenceNumber={booking.referenceNumber}
                            onConfirm={() => handleConfirmPayment("deposit_paid")}
                            confirming={paymentLoading === "deposit_paid"}
                            confirmLabel="I've Completed My Deposit →"
                          />
                        </motion.div>
                      )}

                      {/* DEPOSIT PAID — remaining balance */}
                      {booking.paymentStatus === "deposit_paid" && (
                        <motion.div
                          key="remaining-transfer"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                        >
                          <BankDetailsPanel
                            amount={fmt(jmdDeposit)}
                            jmdAmount={jmdDeposit}
                            amountLabel="Remaining Balance (50%)"
                            currency={currency}
                            rate={rate}
                            referenceNumber={booking.referenceNumber}
                            onConfirm={() => handleConfirmPayment("fully_paid")}
                            confirming={paymentLoading === "fully_paid"}
                            confirmLabel="I've Paid My Remaining Balance →"
                          />
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Fully paid */}
              {booking.paymentStatus === "fully_paid" && (
                <div className="rounded-2xl border border-[#24eda2]/20 bg-[#24eda2]/[0.04] p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#24eda2]/15 flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#24eda2] text-lg font-bold">✓</span>
                  </div>
                  <p className="text-[15px] font-semibold text-[#24eda2] mb-1">Payment Complete</p>
                  <p className="text-[13px] text-white/35">
                    Thank you! Your project is fully confirmed and our team will be in touch shortly.
                  </p>
                </div>
              )}

              {/* No price fallback */}
              {!jmdTotal && booking.paymentStatus === "unpaid" && (
                <div className="rounded-2xl border border-white/[0.06] p-6 text-center">
                  <p className="text-[14px] text-white/40">
                    A custom quote will be sent to you within 24 hours. Contact us at{" "}
                    <a href="mailto:info@eccentricdigital.com" className="text-[#24eda2] hover:underline">
                      info@eccentricdigital.com
                    </a>
                  </p>
                </div>
              )}

              <button
                onClick={() => { setBooking(null); setRef(""); setError(null); setSelectedOption(null); }}
                className="w-full text-[12px] text-white/20 hover:text-white/40 transition-colors pt-2"
              >
                Look up a different reference number
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
