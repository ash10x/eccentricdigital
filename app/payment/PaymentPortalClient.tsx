"use client";

import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BANK_DETAILS } from "@/lib/bankDetails";

type PaymentStatus = "unpaid" | "deposit_paid" | "fully_paid";
type Currency = "JMD" | "USD";

type BookingDetails = {
  type: "booking";
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

type MaintenanceDetails = {
  type: "maintenance";
  maintenanceRef: string;
  existingRef: string | null;
  clientType: "new" | "existing";
  name: string;
  businessName: string;
  packageTitle: string;
  originalPrice: string;
  finalPrice: string;
  discountApplied: boolean;
  subscriptionStart: string;
  subscriptionEnd: string;
  status: "pending" | "active" | "expired";
  paymentStatus: PaymentStatus;
  createdAt: string;
};

type LookupResult = BookingDetails | MaintenanceDetails | null;

const STATUS_CONFIG: Record<PaymentStatus, { label: string; description: string; dot: string; badge: string; text: string }> = {
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
    description: "Payment complete.",
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
    return new Date(dateStr + (dateStr.includes("T") ? "" : "T12:00:00")).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  } catch { return dateStr; }
}

function daysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function subscriptionProgress(start: string, end: string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const n = Date.now();
  return Math.min(100, Math.max(0, ((n - s) / (e - s)) * 100));
}

function isMaintenanceRef(ref: string): boolean {
  return /^MNT-[A-Z0-9]{8}$/.test(ref) || /^ED-[A-Z0-9]{6}-[A-Z0-9]{8}$/.test(ref);
}

function CurrencyToggle({ currency, setCurrency, rate, rateFallback }: {
  currency: Currency; setCurrency: (c: Currency) => void; rate: number | null; rateFallback: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold">Payment Options</p>
      <div className="flex flex-col items-end gap-1">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          {(["JMD", "USD"] as Currency[]).map((c) => (
            <button key={c} onClick={() => setCurrency(c)}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-bold tracking-[1.5px] uppercase transition-all duration-200 ${currency === c ? "bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black shadow-[0_4px_16px_rgba(36,237,162,0.2)]" : "text-white/40 hover:text-white/70"}`}
            >{c}</button>
          ))}
        </div>
        {rate !== null && (
          <p className="text-[10px] text-white/15 tracking-[0.3px]">{rateFallback ? "~" : ""}1 USD ≈ {rate.toLocaleString("en-US", { maximumFractionDigits: 2 })} JMD</p>
        )}
      </div>
    </div>
  );
}

function BankDetailsPanel({ amount, jmdAmount, amountLabel, currency, rate, referenceNumber, onConfirm, confirming, confirmLabel }: {
  amount: string; jmdAmount: number; amountLabel: string; currency: Currency; rate: number | null;
  referenceNumber: string; onConfirm: () => void; confirming: boolean; confirmLabel: string;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 text-center">
        <p className="text-[10px] uppercase tracking-[3px] text-white/25 font-semibold mb-2">{amountLabel}</p>
        <p className="text-[36px] font-black tracking-[-0.03em] bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent leading-none">{amount}</p>
        <p className="text-[12px] text-white/25 mt-1 font-medium">{currency}</p>
        {currency === "USD" && rate && (
          <p className="text-[11px] text-amber-400/70 mt-2">≈ ${jmdAmount.toLocaleString("en-US", { maximumFractionDigits: 0 })} JMD — bank accounts receive JMD</p>
        )}
      </div>
      <div className="rounded-xl border border-[#24eda2]/15 bg-[#24eda2]/[0.03] p-4">
        <p className="text-[11px] text-[#24eda2]/80 font-semibold mb-1">Transfer Description / Reference</p>
        <p className="text-[15px] font-mono font-bold text-white tracking-[2px]">{referenceNumber}</p>
        <p className="text-[11px] text-white/25 mt-1">Use this as the payment description when making your transfer</p>
      </div>
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
      <button onClick={onConfirm} disabled={confirming}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black font-bold text-[14px] tracking-[-0.01em] hover:shadow-[0_16px_48px_rgba(36,237,162,0.25)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >{confirming ? "Confirming…" : confirmLabel}</button>
      <p className="text-[11px] text-white/15 text-center">Only click after your transfer is complete. Our team will verify within 24 hours.</p>
    </div>
  );
}

// ── Maintenance Subscription View ─────────────────────────────────────────────

function MaintenanceView({ sub, onReset, currency, setCurrency, rate, rateFallback }: {
  sub: MaintenanceDetails;
  onReset: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rate: number | null;
  rateFallback: boolean;
}) {
  const [paymentLoading, setPaymentLoading] = useState<PaymentStatus | null>(null);
  const [selectedOption, setSelectedOption] = useState<"full" | "deposit" | null>(null);
  const [currentSub, setCurrentSub] = useState(sub);

  const days = daysRemaining(currentSub.subscriptionEnd);
  const progress = subscriptionProgress(currentSub.subscriptionStart, currentSub.subscriptionEnd);
  const isExpired = days <= 0;
  const isExpiringSoon = days > 0 && days <= 7;
  const payStatus = STATUS_CONFIG[currentSub.paymentStatus];
  const jmdTotal = parseJmdAmount(currentSub.finalPrice);
  const jmdDeposit = Math.round(jmdTotal * 0.5);
  const fmt = (jmd: number) => formatAmount(jmd, currency, rate);

  const handlePayment = async (newStatus: PaymentStatus) => {
    setPaymentLoading(newStatus);
    try {
      const res = await fetch("/api/maintenance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maintenanceRef: currentSub.maintenanceRef, paymentStatus: newStatus }),
      });
      if (res.ok) {
        setCurrentSub((p) => ({ ...p, paymentStatus: newStatus, status: newStatus === "fully_paid" ? "active" : p.status }));
        setSelectedOption(null);
      }
    } finally {
      setPaymentLoading(null);
    }
  };

  return (
    <motion.div
      key="maintenance"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      className="mt-8 space-y-5"
    >
      {/* Header card */}
      <div className="gradient-border rounded-2xl">
        <div className="bg-[#0a0a0a] rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[3px] text-white/20 font-semibold mb-2">Maintenance Reference</p>
              <p className="text-[22px] font-black tracking-[2px] font-mono bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent break-all">
                {currentSub.maintenanceRef}
              </p>
              {currentSub.discountApplied && (
                <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] text-[#24eda2] bg-[#24eda2]/10 px-2.5 py-1 rounded-full font-semibold">
                  ✦ 10% loyalty discount applied
                </span>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <motion.div
                key={currentSub.paymentStatus}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[12px] font-semibold ${payStatus.badge} ${payStatus.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${payStatus.dot} ${currentSub.paymentStatus !== "unpaid" ? "animate-pulse" : ""}`} />
                {payStatus.label}
              </motion.div>
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                isExpired ? "bg-red-500/10 text-red-400" :
                currentSub.status === "active" ? "bg-[#24eda2]/10 text-[#24eda2]" :
                "bg-amber-500/10 text-amber-400"
              }`}>
                {isExpired ? "Expired" : currentSub.status === "active" ? "Active" : "Pending Activation"}
              </span>
            </div>
          </div>

          {/* Subscription timeline */}
          <div className="mt-2">
            <div className="flex justify-between text-[11px] text-white/30 mb-2">
              <span>{new Date(currentSub.subscriptionStart).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              <span className={isExpired ? "text-red-400" : isExpiringSoon ? "text-amber-400" : "text-[#24eda2]"}>
                {isExpired
                  ? `Expired ${Math.abs(days)} day${Math.abs(days) !== 1 ? "s" : ""} ago`
                  : `${days} day${days !== 1 ? "s" : ""} remaining`}
              </span>
              <span>{new Date(currentSub.subscriptionEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${isExpired ? "bg-red-500/60" : isExpiringSoon ? "bg-amber-400" : "bg-gradient-to-r from-[#24eda2] to-[#00a3f8]"}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subscription details */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <p className="text-[10px] uppercase tracking-[4px] text-white/20 font-semibold">Subscription Summary</p>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {[
            { label: "Subscriber", value: currentSub.name + (currentSub.businessName ? ` — ${currentSub.businessName}` : "") },
            { label: "Package", value: currentSub.packageTitle },
            {
              label: "Monthly Rate",
              value: currentSub.discountApplied
                ? `${currentSub.finalPrice} JMD (was ${currentSub.originalPrice})`
                : `${currentSub.finalPrice} JMD`,
            },
            { label: "Start Date", value: formatDate(currentSub.subscriptionStart) },
            { label: "Renewal Date", value: formatDate(currentSub.subscriptionEnd) },
            { label: "Client Type", value: currentSub.clientType === "existing" ? "Returning Client" : "New Subscriber" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between px-6 py-4 gap-4">
              <span className="text-[12px] text-white/30 shrink-0">{label}</span>
              <span className="text-[14px] text-white font-semibold text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment section */}
      {jmdTotal > 0 && currentSub.paymentStatus !== "fully_paid" && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
            <CurrencyToggle currency={currency} setCurrency={setCurrency} rate={rate} rateFallback={rateFallback} />
          </div>
          <div className="p-6">
            <AnimatePresence mode="wait">
              {currentSub.paymentStatus === "unpaid" && selectedOption === null && (
                <motion.div key="opts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                  <button onClick={() => setSelectedOption("full")} className="w-full gradient-border rounded-xl text-left">
                    <div className="bg-[#0a0a0a] rounded-xl p-5 hover:bg-[#0f0f0f] transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[12px] text-white/40 mb-1">Pay in Full</p>
                          <p className="text-[26px] font-black tracking-[-0.03em] bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">{fmt(jmdTotal)} <span className="text-[12px] text-white/30 font-semibold">{currency}</span></p>
                          <p className="text-[11px] text-white/20 mt-1">First month · Activates subscription</p>
                        </div>
                        <span className="text-white/30 text-lg">→</span>
                      </div>
                    </div>
                  </button>
                  <button onClick={() => setSelectedOption("deposit")} className="w-full rounded-xl border border-white/[0.08] p-5 text-left hover:border-white/[0.14] hover:bg-white/[0.02] transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[12px] text-white/40 mb-1">Pay 50% Deposit</p>
                        <p className="text-[26px] font-black tracking-[-0.03em] text-white">{fmt(jmdDeposit)} <span className="text-[12px] text-white/30 font-semibold">{currency}</span></p>
                        <p className="text-[11px] text-white/20 mt-1">Secures your slot · Balance due on start</p>
                      </div>
                      <span className="text-white/30 text-lg">→</span>
                    </div>
                  </button>
                </motion.div>
              )}
              {currentSub.paymentStatus === "unpaid" && selectedOption === "full" && (
                <motion.div key="full" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <button onClick={() => setSelectedOption(null)} className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors mb-4">← Back to options</button>
                  <BankDetailsPanel amount={fmt(jmdTotal)} jmdAmount={jmdTotal} amountLabel="First Month Payment" currency={currency} rate={rate} referenceNumber={currentSub.maintenanceRef} onConfirm={() => handlePayment("fully_paid")} confirming={paymentLoading === "fully_paid"} confirmLabel="I've Completed My Transfer →" />
                </motion.div>
              )}
              {currentSub.paymentStatus === "unpaid" && selectedOption === "deposit" && (
                <motion.div key="dep" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <button onClick={() => setSelectedOption(null)} className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors mb-4">← Back to options</button>
                  <BankDetailsPanel amount={fmt(jmdDeposit)} jmdAmount={jmdDeposit} amountLabel="Deposit Amount (50%)" currency={currency} rate={rate} referenceNumber={currentSub.maintenanceRef} onConfirm={() => handlePayment("deposit_paid")} confirming={paymentLoading === "deposit_paid"} confirmLabel="I've Completed My Deposit →" />
                </motion.div>
              )}
              {currentSub.paymentStatus === "deposit_paid" && (
                <motion.div key="rem" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <BankDetailsPanel amount={fmt(jmdDeposit)} jmdAmount={jmdDeposit} amountLabel="Remaining Balance (50%)" currency={currency} rate={rate} referenceNumber={currentSub.maintenanceRef} onConfirm={() => handlePayment("fully_paid")} confirming={paymentLoading === "fully_paid"} confirmLabel="I've Paid My Remaining Balance →" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {currentSub.paymentStatus === "fully_paid" && (
        <div className="rounded-2xl border border-[#24eda2]/20 bg-[#24eda2]/[0.04] p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-[#24eda2]/15 flex items-center justify-center mx-auto mb-3">
            <span className="text-[#24eda2] text-lg font-bold">✓</span>
          </div>
          <p className="text-[15px] font-semibold text-[#24eda2] mb-1">Subscription Active</p>
          <p className="text-[13px] text-white/35">Your maintenance subscription is confirmed and active.</p>
        </div>
      )}

      {/* Renew / Upgrade CTAs */}
      <div className={`rounded-2xl border p-6 space-y-4 ${isExpired ? "border-red-500/20 bg-red-500/[0.04]" : "border-white/[0.06] bg-white/[0.02]"}`}>
        {isExpired && (
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <p className="text-[13px] text-red-400 font-semibold">Your subscription has expired. Renew to restore your maintenance coverage.</p>
          </div>
        )}
        {isExpiringSoon && !isExpired && (
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <p className="text-[13px] text-amber-400 font-semibold">Expiring in {days} day{days !== 1 ? "s" : ""}. Renew now to keep uninterrupted coverage.</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={`/contact?service=maintenance&renew=1&ref=${encodeURIComponent(currentSub.maintenanceRef)}`}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black font-bold text-[14px] hover:shadow-[0_16px_48px_rgba(36,237,162,0.25)] hover:-translate-y-0.5 transition-all duration-300"
          >
            ↺ Renew Subscription
          </Link>
          <Link
            href="/contact?service=maintenance"
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/[0.08] text-white/70 font-semibold text-[14px] hover:border-[#24eda2]/30 hover:text-white transition-all"
          >
            ↑ Upgrade Package
          </Link>
        </div>
        <p className="text-[11px] text-white/20 text-center">Renewing as an existing client preserves your 10% loyalty discount.</p>
      </div>

      <button onClick={onReset} className="w-full text-[12px] text-white/20 hover:text-white/40 transition-colors pt-2">
        Look up a different reference number
      </button>
    </motion.div>
  );
}

// ── Main Portal Component ──────────────────────────────────────────────────────

export default function PaymentPortalClient() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressScale = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState<PaymentStatus | null>(null);
  const [selectedOption, setSelectedOption] = useState<"full" | "deposit" | null>(null);

  const [currency, setCurrency] = useState<Currency>("JMD");
  const [rate, setRate] = useState<number | null>(null);
  const [rateFallback, setRateFallback] = useState(false);

  useEffect(() => {
    fetch("/api/exchange-rate")
      .then((r) => r.json())
      .then((data) => { if (data.rate) { setRate(data.rate); setRateFallback(!!data.fallback); } })
      .catch(() => { setRate(157); setRateFallback(true); });
  }, []);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = ref.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedOption(null);
    try {
      const endpoint = isMaintenanceRef(trimmed)
        ? `/api/maintenance?ref=${encodeURIComponent(trimmed)}`
        : `/api/payment?ref=${encodeURIComponent(trimmed)}`;

      const res = await fetch(endpoint);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        // Normalise booking response to add type field
        setResult(data.type === "maintenance" ? data : { ...data, type: "booking" });
      }
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingPayment = async (newStatus: PaymentStatus) => {
    if (!result || result.type !== "booking") return;
    setPaymentLoading(newStatus);
    try {
      const res = await fetch("/api/payment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceNumber: result.referenceNumber, paymentStatus: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult((prev) => prev && prev.type === "booking" ? { ...prev, paymentStatus: data.paymentStatus } : prev);
        setSelectedOption(null);
      }
    } finally {
      setPaymentLoading(null);
    }
  };

  const handleReset = () => { setResult(null); setRef(""); setError(null); setSelectedOption(null); };

  const booking = result?.type === "booking" ? result : null;
  const maintenance = result?.type === "maintenance" ? result : null;

  const jmdTotal = booking ? parseJmdAmount(booking.price) : 0;
  const jmdDeposit = Math.round(jmdTotal * 0.5);
  const status = booking ? STATUS_CONFIG[booking.paymentStatus] : null;
  const fmt = (jmd: number) => formatAmount(jmd, currency, rate);

  return (
    <main ref={containerRef} className="bg-[#060606] text-white min-h-screen overflow-x-hidden relative">
      <motion.div style={{ scaleX: progressScale }} className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#24eda2] to-[#00a3f8] origin-left z-50" />

      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-center px-6 overflow-hidden pt-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#24eda2]/[0.05] blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#00a3f8]/[0.04] blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24eda2] animate-pulse" />
            <span className="text-[11px] uppercase tracking-[3px] text-white/50 font-semibold">Payment Portal</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[48px] md:text-[64px] font-black leading-[0.92] tracking-[-0.04em] mb-6">
            Track Your
            <br />
            <span className="bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">Booking.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}
            className="text-[16px] text-white/40 max-w-md mx-auto leading-relaxed tracking-[-0.01em] mb-10">
            Enter your reference number to view booking details, subscription status, and payment instructions.
          </motion.p>

          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
            onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="text"
              value={ref}
              onChange={(e) => setRef(e.target.value.toUpperCase())}
              placeholder="ED-XXXXXX  or  MNT-XXXXXXXX"
              spellCheck={false}
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/20 text-[14px] font-mono tracking-[1.5px] focus:outline-none focus:border-[#24eda2]/40 transition-colors"
            />
            <button type="submit" disabled={loading || !ref.trim()}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#24eda2] to-[#00a3f8] text-black font-bold text-[14px] tracking-[-0.01em] hover:shadow-[0_16px_48px_rgba(36,237,162,0.3)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none whitespace-nowrap">
              {loading ? "Looking up…" : "Look Up →"}
            </button>
          </motion.form>
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section className="px-6 max-w-2xl mx-auto pb-40">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-5 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              <p className="text-[14px] text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Maintenance subscription result */}
          {maintenance && (
            <MaintenanceView sub={maintenance} onReset={handleReset} currency={currency} setCurrency={setCurrency} rate={rate} rateFallback={rateFallback} />
          )}

          {/* Booking result */}
          {booking && status && (
            <motion.div key="booking" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="mt-8 space-y-5">
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
                      <motion.div key={booking.paymentStatus} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[12px] font-semibold shrink-0 ${status.badge} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${booking.paymentStatus !== "unpaid" ? "animate-pulse" : ""}`} />
                        {status.label}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <p className={`text-[12px] mt-3 ${status.text} opacity-70`}>{status.description}</p>
                </div>
              </div>

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

              {jmdTotal > 0 && booking.paymentStatus !== "fully_paid" && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                  <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
                    <CurrencyToggle currency={currency} setCurrency={setCurrency} rate={rate} rateFallback={rateFallback} />
                  </div>
                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      {booking.paymentStatus === "unpaid" && selectedOption === null && (
                        <motion.div key="options" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                          <button onClick={() => setSelectedOption("full")} className="w-full gradient-border rounded-xl text-left">
                            <div className="bg-[#0a0a0a] rounded-xl p-5 hover:bg-[#0f0f0f] transition-colors">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-[12px] text-white/40 mb-1">Pay in Full</p>
                                  <p className="text-[26px] font-black tracking-[-0.03em] bg-gradient-to-r from-[#24eda2] to-[#00a3f8] bg-clip-text text-transparent">{fmt(jmdTotal)} <span className="text-[12px] text-white/30 font-semibold ml-1.5">{currency}</span></p>
                                  <p className="text-[11px] text-white/20 mt-1">One-time · Full project access</p>
                                </div>
                                <span className="text-white/30 text-lg">→</span>
                              </div>
                            </div>
                          </button>
                          <button onClick={() => setSelectedOption("deposit")} className="w-full rounded-xl border border-white/[0.08] p-5 text-left hover:border-white/[0.14] hover:bg-white/[0.02] transition-all">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[12px] text-white/40 mb-1">Pay 50% Deposit</p>
                                <p className="text-[26px] font-black tracking-[-0.03em] text-white">{fmt(jmdDeposit)} <span className="text-[12px] text-white/30 font-semibold ml-1.5">{currency}</span></p>
                                <p className="text-[11px] text-white/20 mt-1">Secures your slot · Balance due on delivery</p>
                              </div>
                              <span className="text-white/30 text-lg">→</span>
                            </div>
                          </button>
                        </motion.div>
                      )}
                      {booking.paymentStatus === "unpaid" && selectedOption === "full" && (
                        <motion.div key="full-transfer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                          <button onClick={() => setSelectedOption(null)} className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors mb-4">← Back to options</button>
                          <BankDetailsPanel amount={fmt(jmdTotal)} jmdAmount={jmdTotal} amountLabel="Full Payment Amount" currency={currency} rate={rate} referenceNumber={booking.referenceNumber} onConfirm={() => handleBookingPayment("fully_paid")} confirming={paymentLoading === "fully_paid"} confirmLabel="I've Completed My Transfer →" />
                        </motion.div>
                      )}
                      {booking.paymentStatus === "unpaid" && selectedOption === "deposit" && (
                        <motion.div key="deposit-transfer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                          <button onClick={() => setSelectedOption(null)} className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors mb-4">← Back to options</button>
                          <BankDetailsPanel amount={fmt(jmdDeposit)} jmdAmount={jmdDeposit} amountLabel="Deposit Amount (50%)" currency={currency} rate={rate} referenceNumber={booking.referenceNumber} onConfirm={() => handleBookingPayment("deposit_paid")} confirming={paymentLoading === "deposit_paid"} confirmLabel="I've Completed My Deposit →" />
                        </motion.div>
                      )}
                      {booking.paymentStatus === "deposit_paid" && (
                        <motion.div key="remaining-transfer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                          <BankDetailsPanel amount={fmt(jmdDeposit)} jmdAmount={jmdDeposit} amountLabel="Remaining Balance (50%)" currency={currency} rate={rate} referenceNumber={booking.referenceNumber} onConfirm={() => handleBookingPayment("fully_paid")} confirming={paymentLoading === "fully_paid"} confirmLabel="I've Paid My Remaining Balance →" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {booking.paymentStatus === "fully_paid" && (
                <div className="rounded-2xl border border-[#24eda2]/20 bg-[#24eda2]/[0.04] p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#24eda2]/15 flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#24eda2] text-lg font-bold">✓</span>
                  </div>
                  <p className="text-[15px] font-semibold text-[#24eda2] mb-1">Payment Complete</p>
                  <p className="text-[13px] text-white/35">Thank you! Your project is fully confirmed and our team will be in touch shortly.</p>
                </div>
              )}

              {!jmdTotal && booking.paymentStatus === "unpaid" && (
                <div className="rounded-2xl border border-white/[0.06] p-6 text-center">
                  <p className="text-[14px] text-white/40">A custom quote will be sent to you within 24 hours. Contact us at{" "}
                    <a href="mailto:info@eccentricdigital.com" className="text-[#24eda2] hover:underline">info@eccentricdigital.com</a>
                  </p>
                </div>
              )}

              <button onClick={handleReset} className="w-full text-[12px] text-white/20 hover:text-white/40 transition-colors pt-2">
                Look up a different reference number
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
