"use client";

import { useEffect, useState } from "react";
import Modal from "../components/Modal";

interface Package {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  features: string[];
  paymentType: string;
  isFeatured: boolean;
  serviceKeys: string[];
  displayOrder: number;
}

const empty = {
  title: "", description: "", imageUrl: "", price: "",
  features: [] as string[], paymentType: "One-time investment",
  isFeatured: false, serviceKeys: [] as string[], displayOrder: 0,
};

export default function PackagesPage() {
  const [items, setItems] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [featuresInput, setFeaturesInput] = useState("");
  const [serviceKeysInput, setServiceKeysInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch("/api/admin/packages");
    setItems(await res.json());
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm({ ...empty });
    setFeaturesInput("");
    setServiceKeysInput("");
    setModal(true);
  }

  function openEdit(item: Package) {
    setEditing(item);
    setForm({ title: item.title, description: item.description, imageUrl: item.imageUrl, price: item.price, features: item.features, paymentType: item.paymentType, isFeatured: item.isFeatured, serviceKeys: item.serviceKeys, displayOrder: item.displayOrder });
    setFeaturesInput(item.features.join("\n"));
    setServiceKeysInput(item.serviceKeys.join(", "));
    setModal(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      ...form,
      features: featuresInput.split("\n").map((f) => f.trim()).filter(Boolean),
      serviceKeys: serviceKeysInput.split(",").map((k) => k.trim()).filter(Boolean),
    };
    if (editing) {
      await fetch(`/api/admin/packages/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else {
      await fetch("/api/admin/packages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    await fetchData();
    setModal(false);
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this package?")) return;
    await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Packages</h1>
          <p className="text-white/40 text-sm mt-0.5">Pricing tiers</p>
        </div>
        <button onClick={openNew} className="bg-[#24eda2] hover:bg-[#1dd48f] text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + New Package
        </button>
      </div>

      {loading ? (
        <div className="text-white/30 text-sm py-16 text-center">Loading…</div>
      ) : (
        <div className="bg-[#0d0d0d] border border-white/8 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Title", "Price", "Payment Type", "Featured", "Features", "Order", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-white/30">No packages yet</td></tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3 text-white font-medium">{item.title}</td>
                  <td className="px-5 py-3 text-[#24eda2] font-mono text-sm">{item.price}</td>
                  <td className="px-5 py-3 text-white/50 text-xs">{item.paymentType}</td>
                  <td className="px-5 py-3">
                    {item.isFeatured && <span className="text-xs px-2 py-0.5 rounded-full bg-[#24eda2]/10 text-[#24eda2]">Featured</span>}
                  </td>
                  <td className="px-5 py-3 text-white/50 text-xs">{item.features.length} items</td>
                  <td className="px-5 py-3 text-white/50 text-xs">{item.displayOrder}</td>
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
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Package" : "New Package"}>
        <div className="space-y-4">
          {[
            { field: "title", label: "Title", type: "text" },
            { field: "price", label: "Price (e.g. $25,000)", type: "text" },
            { field: "imageUrl", label: "Image URL", type: "text" },
            { field: "displayOrder", label: "Display Order", type: "number" },
          ].map(({ field, label, type }) => (
            <div key={field}>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">{label}</label>
              <input
                type={type}
                value={(form as Record<string, string | number | boolean | string[]>)[field] as string | number}
                onChange={(e) => setForm({ ...form, [field]: type === "number" ? Number(e.target.value) : e.target.value })}
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Payment Type</label>
            <select
              value={form.paymentType}
              onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
            >
              <option value="One-time investment">One-time investment</option>
              <option value="Monthly subscription">Monthly subscription</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Features (one per line)</label>
            <textarea
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              rows={5}
              placeholder="Custom design&#10;Mobile responsive&#10;SEO optimized"
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors resize-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Service Keys (comma-separated)</label>
            <input
              type="text"
              value={serviceKeysInput}
              onChange={(e) => setServiceKeysInput(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="w-4 h-4 accent-[#24eda2]"
            />
            <span className="text-sm text-white/70">Mark as Featured</span>
          </label>
          <button onClick={handleSave} disabled={saving} className="w-full bg-[#24eda2] hover:bg-[#1dd48f] text-black font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 mt-2">
            {saving ? "Saving…" : editing ? "Save Changes" : "Create Package"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
