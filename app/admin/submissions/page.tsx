"use client";

import { useEffect, useState } from "react";

interface Submission {
  id: number;
  referenceNumber: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  service: string;
  selectedPackage: string;
  price: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  paymentStatus: string;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: "unpaid", label: "Unpaid", color: "text-red-400 bg-red-500/10" },
  { value: "deposit_paid", label: "Deposit Paid", color: "text-amber-400 bg-amber-500/10" },
  { value: "fully_paid", label: "Fully Paid", color: "text-[#24eda2] bg-[#24eda2]/10" },
];

const statusStyle = (s: string) =>
  STATUS_OPTIONS.find((o) => o.value === s) ?? { label: s, color: "text-white/40 bg-white/5" };

export default function SubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState<Submission | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch("/api/admin/submissions");
    setItems(await res.json());
    setLoading(false);
  }

  async function updateStatus(id: number, paymentStatus: string) {
    setUpdating(id);
    await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, paymentStatus }),
    });
    await fetchData();
    if (detail?.id === id) setDetail((d) => d ? { ...d, paymentStatus } : null);
    setUpdating(null);
  }

  async function deleteItem(id: number) {
    if (!confirm("Delete this submission?")) return;
    await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (detail?.id === id) setDetail(null);
  }

  const filtered = filter === "all" ? items : items.filter((i) => i.paymentStatus === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Submissions</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} total leads</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { value: "all", label: "All" },
          ...STATUS_OPTIONS,
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
              filter === opt.value
                ? "border-[#24eda2]/30 bg-[#24eda2]/10 text-[#24eda2]"
                : "border-white/10 text-white/50 hover:text-white hover:border-white/20"
            }`}
          >
            {opt.label}
            <span className="ml-1.5 opacity-60">
              {opt.value === "all"
                ? items.length
                : items.filter((i) => i.paymentStatus === opt.value).length}
            </span>
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
                    {["Ref", "Name", "Service", "Package", "Price", "Date", "Status", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-white/30 text-xs uppercase tracking-wider font-normal whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-white/30 text-sm">No submissions</td>
                    </tr>
                  )}
                  {filtered.map((sub) => {
                    const s = statusStyle(sub.paymentStatus);
                    return (
                      <tr
                        key={sub.id}
                        className={`border-b border-white/5 cursor-pointer transition-colors ${
                          detail?.id === sub.id ? "bg-white/5" : "hover:bg-white/3"
                        }`}
                        onClick={() => setDetail(sub)}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-white/50">{sub.referenceNumber}</td>
                        <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{sub.name}</td>
                        <td className="px-4 py-3 text-white/60 whitespace-nowrap">{sub.service}</td>
                        <td className="px-4 py-3 text-white/60 whitespace-nowrap max-w-[140px] truncate">{sub.selectedPackage}</td>
                        <td className="px-4 py-3 text-white/60 whitespace-nowrap">{sub.price}</td>
                        <td className="px-4 py-3 text-white/40 whitespace-nowrap text-xs">{sub.preferredDate}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${s.color}`}>
                            {s.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteItem(sub.id); }}
                            className="text-white/20 hover:text-red-400 transition-colors text-xs"
                          >
                            ✕
                          </button>
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
            <div className="w-72 shrink-0 bg-[#0d0d0d] border border-white/8 rounded-xl p-5 self-start sticky top-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[#24eda2] font-mono text-xs">{detail.referenceNumber}</p>
                  <p className="text-white font-semibold mt-0.5">{detail.name}</p>
                </div>
                <button onClick={() => setDetail(null)} className="text-white/30 hover:text-white text-sm">✕</button>
              </div>

              <div className="space-y-2 text-sm mb-5">
                {[
                  ["Email", detail.email],
                  ["Phone", detail.phone],
                  ...(detail.businessName ? [["Business", detail.businessName]] : []),
                  ["Service", detail.service],
                  ["Package", detail.selectedPackage],
                  ["Price", detail.price],
                  ["Date", detail.preferredDate],
                  ["Time", detail.preferredTime],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <span className="text-white/40 shrink-0">{label}</span>
                    <span className="text-white/80 text-right truncate">{value || "—"}</span>
                  </div>
                ))}
                {detail.message && (
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-white/40 text-xs mb-1">Message</p>
                    <p className="text-white/70 text-xs leading-relaxed">{detail.message}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Payment Status</p>
                <div className="space-y-1.5">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      disabled={updating === detail.id}
                      onClick={() => updateStatus(detail.id, opt.value)}
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
