"use client";

import { useEffect, useState } from "react";
import Modal from "../components/Modal";

interface Stat {
  id: number;
  value: string;
  label: string;
  page: string;
  displayOrder: number;
}

const empty = { value: "", label: "", page: "home", displayOrder: 0 };
const PAGES = ["home", "about", "services"];

export default function StatsPage() {
  const [items, setItems] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Stat | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch("/api/admin/stats");
    setItems(await res.json());
    setLoading(false);
  }

  function openNew() { setEditing(null); setForm({ ...empty }); setModal(true); }

  function openEdit(item: Stat) {
    setEditing(item);
    setForm({ value: item.value, label: item.label, page: item.page, displayOrder: item.displayOrder });
    setModal(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editing) {
      await fetch(`/api/admin/stats/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/admin/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    await fetchData();
    setModal(false);
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this stat?")) return;
    await fetch(`/api/admin/stats/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const grouped = PAGES.reduce((acc, page) => {
    acc[page] = items.filter((i) => i.page === page);
    return acc;
  }, {} as Record<string, Stat[]>);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Stats</h1>
          <p className="text-white/40 text-sm mt-0.5">Page statistics &amp; metrics</p>
        </div>
        <button onClick={openNew} className="bg-[#24eda2] hover:bg-[#1dd48f] text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + New Stat
        </button>
      </div>

      {loading ? (
        <div className="text-white/30 text-sm py-16 text-center">Loading…</div>
      ) : (
        <div className="space-y-6">
          {PAGES.map((page) => (
            <div key={page} className="bg-[#0d0d0d] border border-white/8 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
                <span className="text-[#24eda2] text-xs font-semibold uppercase tracking-widest">{page}</span>
                <span className="text-white/20 text-xs">page</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Value", "Label", "Order", ""].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grouped[page].length === 0 && (
                    <tr><td colSpan={4} className="text-center py-6 text-white/20 text-xs">No stats for this page</td></tr>
                  )}
                  {grouped[page].map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3 text-[#24eda2] font-bold font-mono">{item.value}</td>
                      <td className="px-5 py-3 text-white/70">{item.label}</td>
                      <td className="px-5 py-3 text-white/30 text-xs">{item.displayOrder}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(item)} className="text-white/40 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/5 transition-all">Edit</button>
                          <button onClick={() => handleDelete(item.id)} className="text-white/40 hover:text-red-400 text-xs px-2 py-1 rounded hover:bg-red-500/10 transition-all">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Stat" : "New Stat"}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Value (e.g. +120%)</label>
            <input
              type="text"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Label</label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Page</label>
            <select
              value={form.page}
              onChange={(e) => setForm({ ...form, page: e.target.value })}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
            >
              {PAGES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Display Order</label>
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
            />
          </div>
          <button onClick={handleSave} disabled={saving} className="w-full bg-[#24eda2] hover:bg-[#1dd48f] text-black font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 mt-2">
            {saving ? "Saving…" : editing ? "Save Changes" : "Create Stat"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
