"use client";

import { useEffect, useState } from "react";

interface Subscription {
  id: number;
  maintenanceRef: string;
  existingRef: string | null;
  clientType: "new" | "existing";
  name: string;
  businessName: string;
  email: string;
  phone: string;
  packageTitle: string;
  originalPrice: string;
  finalPrice: string;
  discountApplied: boolean;
  subscriptionStart: string;
  subscriptionEnd: string;
  status: string;
  computedStatus: string;
  paymentStatus: string;
  daysRemaining: number;
  createdAt: string;
}

const PAYMENT_OPTIONS = [
  { value: "unpaid", label: "Unpaid", color: "text-red-400 bg-red-500/10" },
  { value: "deposit_paid", label: "Deposit Paid", color: "text-amber-400 bg-amber-500/10" },
  { value: "fully_paid", label: "Fully Paid", color: "text-[#24eda2] bg-[#24eda2]/10" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "text-amber-400 bg-amber-500/10" },
  { value: "active", label: "Active", color: "text-[#24eda2] bg-[#24eda2]/10" },
  { value: "expired", label: "Expired", color: "text-red-400 bg-red-500/10" },
  { value: "cancelled", label: "Cancelled", color: "text-white/40 bg-white/5" },
];

const paymentStyle = (v: string) => PAYMENT_OPTIONS.find((o) => o.value === v) ?? { label: v, color: "text-white/40 bg-white/5" };
const statusStyle = (v: string) => STATUS_OPTIONS.find((o) => o.value === v) ?? { label: v, color: "text-white/40 bg-white/5" };

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type Filter = "all" | "active" | "expired" | "pending" | "cancelled";

export default function MaintenancePage() {
  const [items, setItems] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [detail, setDetail] = useState<Subscription | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch("/api/admin/maintenance-subscriptions");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  async function updateSub(id: number, patch: { paymentStatus?: string; status?: string }) {
    setUpdating(true);
    const res = await fetch("/api/admin/maintenance-subscriptions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((s) => s.id === id ? { ...s, ...updated } : s));
    setDetail((d) => d?.id === id ? { ...d, ...updated } : d);
    setUpdating(false);
  }

  async function deleteSub(id: number) {
    if (!confirm("Delete this subscription? This cannot be undone.")) return;
    await fetch(`/api/admin/maintenance-subscriptions/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((s) => s.id !== id));
    if (detail?.id === id) setDetail(null);
  }

  const filtered = filter === "all"
    ? items
    : items.filter((s) => s.computedStatus === filter);

  const counts: Record<Filter, number> = {
    all: items.length,
    active: items.filter((s) => s.computedStatus === "active").length,
    expired: items.filter((s) => s.computedStatus === "expired").length,
    pending: items.filter((s) => s.computedStatus === "pending").length,
    cancelled: items.filter((s) => s.computedStatus === "cancelled").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Maintenance Subscriptions</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} total subscriptions</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {(["all", "active", "pending", "expired", "cancelled"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
              filter === f
                ? "border-[#24eda2]/30 bg-[#24eda2]/10 text-[#24eda2]"
                : "border-white/10 text-white/50 hover:text-white hover:border-white/20"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 opacity-60">{counts[f]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-white/30 text-sm py-16 text-center">Loading…</div>
      ) : (
        <div className="flex gap-5">
          {/* Table */}
          <div className="flex-1 min-w-0 bg-[#0d0d0d] border border-white/8 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Reference", "Subscriber", "Package", "Price", "Renews", "Status", "Payment", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-white/30 text-xs uppercase tracking-wider font-normal whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-12 text-white/30 text-sm">No subscriptions</td></tr>
                  )}
                  {filtered.map((sub) => {
                    const ps = paymentStyle(sub.paymentStatus);
                    const ss = statusStyle(sub.computedStatus);
                    const isExpiringSoon = sub.daysRemaining > 0 && sub.daysRemaining <= 7;
                    return (
                      <tr
                        key={sub.id}
                        onClick={() => setDetail(sub)}
                        className={`border-b border-white/5 cursor-pointer transition-colors ${detail?.id === sub.id ? "bg-white/5" : "hover:bg-white/3"}`}
                      >
                        <td className="px-4 py-3 font-mono text-xs">
                          <div className={sub.clientType === "existing" ? "text-[#00a3f8]" : "text-white/60"}>
                            {sub.maintenanceRef}
                          </div>
                          {sub.clientType === "existing" && (
                            <div className="text-white/25 text-[10px] mt-0.5">↑ {sub.existingRef}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-white font-medium whitespace-nowrap">{sub.name}</div>
                          {sub.businessName && <div className="text-white/40 text-xs">{sub.businessName}</div>}
                        </td>
                        <td className="px-4 py-3 text-white/60 whitespace-nowrap max-w-[140px] truncate">{sub.packageTitle}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className={sub.discountApplied ? "text-[#24eda2] font-mono text-xs" : "text-white/60 font-mono text-xs"}>
                            {sub.finalPrice}
                          </div>
                          {sub.discountApplied && (
                            <div className="text-white/25 text-[10px] line-through">{sub.originalPrice}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className={`text-xs ${isExpiringSoon ? "text-amber-400" : sub.computedStatus === "expired" ? "text-red-400" : "text-white/40"}`}>
                            {fmtDate(sub.subscriptionEnd)}
                          </div>
                          <div className={`text-[10px] mt-0.5 ${isExpiringSoon ? "text-amber-400/70" : sub.computedStatus === "expired" ? "text-red-400/70" : "text-white/20"}`}>
                            {sub.daysRemaining > 0 ? `${sub.daysRemaining}d left` : `${Math.abs(sub.daysRemaining)}d ago`}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${ss.color}`}>{ss.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${ps.color}`}>{ps.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteSub(sub.id); }}
                            className="text-white/20 hover:text-red-400 transition-colors text-xs"
                          >✕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail panel */}
          {detail && (
            <div className="w-72 shrink-0 bg-[#0d0d0d] border border-white/8 rounded-xl p-5 self-start sticky top-8 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className={`font-mono text-xs font-bold ${detail.clientType === "existing" ? "text-[#00a3f8]" : "text-[#24eda2]"}`}>
                    {detail.maintenanceRef}
                  </p>
                  {detail.existingRef && (
                    <p className="text-white/30 text-[10px] mt-0.5">↑ {detail.existingRef}</p>
                  )}
                  <p className="text-white font-semibold mt-1">{detail.name}</p>
                  {detail.businessName && <p className="text-white/40 text-xs">{detail.businessName}</p>}
                </div>
                <button onClick={() => setDetail(null)} className="text-white/30 hover:text-white text-sm">✕</button>
              </div>

              {/* Subscription timeline */}
              <div>
                {(() => {
                  const total = new Date(detail.subscriptionEnd).getTime() - new Date(detail.subscriptionStart).getTime();
                  const elapsed = Date.now() - new Date(detail.subscriptionStart).getTime();
                  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
                  const isExpired = detail.daysRemaining <= 0;
                  const isSoon = detail.daysRemaining > 0 && detail.daysRemaining <= 7;
                  return (
                    <div>
                      <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
                        <span>{fmtDate(detail.subscriptionStart)}</span>
                        <span className={isExpired ? "text-red-400" : isSoon ? "text-amber-400" : "text-[#24eda2]"}>
                          {isExpired ? `${Math.abs(detail.daysRemaining)}d expired` : `${detail.daysRemaining}d left`}
                        </span>
                        <span>{fmtDate(detail.subscriptionEnd)}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isExpired ? "bg-red-500/60" : isSoon ? "bg-amber-400" : "bg-gradient-to-r from-[#24eda2] to-[#00a3f8]"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                {[
                  ["Email", detail.email],
                  ["Phone", detail.phone],
                  ["Package", detail.packageTitle],
                  ["Rate", detail.discountApplied ? `${detail.finalPrice} (was ${detail.originalPrice})` : detail.finalPrice],
                  ["Client", detail.clientType === "existing" ? "Returning (10% off)" : "New Subscriber"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <span className="text-white/40 shrink-0">{label}</span>
                    <span className="text-white/80 text-right text-xs truncate">{value}</span>
                  </div>
                ))}
              </div>

              {/* Subscription status controls */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Subscription Status</p>
                <div className="space-y-1.5">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      disabled={updating}
                      onClick={() => updateSub(detail.id, { status: opt.value })}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                        detail.computedStatus === opt.value
                          ? `${opt.color} border-current/20`
                          : "border-white/5 text-white/40 hover:text-white hover:border-white/15"
                      }`}
                    >
                      {detail.computedStatus === opt.value ? "● " : "○ "}{opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment status controls */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Payment Status</p>
                <div className="space-y-1.5">
                  {PAYMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      disabled={updating}
                      onClick={() => updateSub(detail.id, { paymentStatus: opt.value })}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                        detail.paymentStatus === opt.value
                          ? `${opt.color} border-current/20`
                          : "border-white/5 text-white/40 hover:text-white hover:border-white/15"
                      }`}
                    >
                      {detail.paymentStatus === opt.value ? "● " : "○ "}{opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => deleteSub(detail.id)}
                className="w-full text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all py-2 rounded-lg border border-transparent hover:border-red-500/20"
              >
                Delete Subscription
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
