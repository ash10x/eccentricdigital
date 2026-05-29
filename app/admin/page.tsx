"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardData {
  submissions: { total: number; unpaid: number; depositPaid: number; fullyPaid: number };
  counts: { projects: number; services: number; packages: number; team: number; stats: number; socialLinks: number };
  recentSubmissions: Array<{
    id: number;
    referenceNumber: string;
    name: string;
    email: string;
    service: string;
    selectedPackage: string;
    price: string;
    paymentStatus: string;
    createdAt: string;
  }>;
}

const statusLabel: Record<string, { label: string; color: string }> = {
  unpaid: { label: "Unpaid", color: "text-red-400 bg-red-500/10" },
  deposit_paid: { label: "Deposit Paid", color: "text-amber-400 bg-amber-500/10" },
  fully_paid: { label: "Fully Paid", color: "text-[#24eda2] bg-[#24eda2]/10" },
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/30 text-sm">Loading…</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Welcome back, Admin</p>
      </div>

      {/* Submission stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total Leads", value: data.submissions.total, color: "text-white" },
          { label: "Unpaid", value: data.submissions.unpaid, color: "text-red-400" },
          { label: "Deposit Paid", value: data.submissions.depositPaid, color: "text-amber-400" },
          { label: "Fully Paid", value: data.submissions.fullyPaid, color: "text-[#24eda2]" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0d0d0d] border border-white/8 rounded-xl p-5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Entity counts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: "Projects", value: data.counts.projects, href: "/admin/projects" },
          { label: "Services", value: data.counts.services, href: "/admin/services" },
          { label: "Packages", value: data.counts.packages, href: "/admin/packages" },
          { label: "Team", value: data.counts.team, href: "/admin/team" },
          { label: "Stats", value: data.counts.stats, href: "/admin/stats" },
          { label: "Social Links", value: data.counts.socialLinks, href: "/admin/settings" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="bg-[#0d0d0d] border border-white/8 rounded-xl p-4 hover:border-[#24eda2]/20 transition-colors group"
          >
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{item.label}</p>
            <p className="text-xl font-bold text-white group-hover:text-[#24eda2] transition-colors">{item.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent submissions */}
      <div className="bg-[#0d0d0d] border border-white/8 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="text-white font-semibold text-sm">Recent Submissions</h2>
          <Link href="/admin/submissions" className="text-[#24eda2] text-xs hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider font-normal">Ref</th>
                <th className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider font-normal">Name</th>
                <th className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider font-normal hidden md:table-cell">Service</th>
                <th className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider font-normal hidden lg:table-cell">Price</th>
                <th className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-white/30 text-sm">No submissions yet</td>
                </tr>
              ) : (
                data.recentSubmissions.map((sub) => {
                  const s = statusLabel[sub.paymentStatus] ?? { label: sub.paymentStatus, color: "text-white/50 bg-white/5" };
                  return (
                    <tr key={sub.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3 text-white/60 font-mono text-xs">{sub.referenceNumber}</td>
                      <td className="px-5 py-3 text-white">{sub.name}</td>
                      <td className="px-5 py-3 text-white/60 hidden md:table-cell">{sub.service}</td>
                      <td className="px-5 py-3 text-white/60 hidden lg:table-cell">{sub.price}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.color}`}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
