"use client";

import { useEffect, useState } from "react";
import Modal from "../components/Modal";

interface Service {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  route: string;
  tags: string[];
  displayOrder: number;
}

const empty = { title: "", description: "", imageUrl: "", route: "", tags: [] as string[], displayOrder: 0 };

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch("/api/admin/services");
    setItems(await res.json());
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm({ ...empty });
    setTagsInput("");
    setModal(true);
  }

  function openEdit(item: Service) {
    setEditing(item);
    setForm({ title: item.title, description: item.description, imageUrl: item.imageUrl, route: item.route, tags: item.tags, displayOrder: item.displayOrder });
    setTagsInput(item.tags.join(", "));
    setModal(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form, tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean) };
    if (editing) {
      await fetch(`/api/admin/services/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else {
      await fetch("/api/admin/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    await fetchData();
    setModal(false);
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-white/40 text-sm mt-0.5">Service offerings</p>
        </div>
        <button onClick={openNew} className="bg-[#24eda2] hover:bg-[#1dd48f] text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + New Service
        </button>
      </div>

      {loading ? (
        <div className="text-white/30 text-sm py-16 text-center">Loading…</div>
      ) : (
        <div className="bg-[#0d0d0d] border border-white/8 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Title", "Route", "Tags", "Order", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-white/30">No services yet</td></tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3 text-white font-medium">{item.title}</td>
                  <td className="px-5 py-3 text-white/50 text-xs">{item.route}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/50">{tag}</span>
                      ))}
                    </div>
                  </td>
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

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Service" : "New Service"}>
        <div className="space-y-4">
          {[
            { field: "title", label: "Title", type: "text" },
            { field: "route", label: "Route (e.g. /services/custom-web-design)", type: "text" },
            { field: "imageUrl", label: "Image URL", type: "text" },
            { field: "displayOrder", label: "Display Order", type: "number" },
          ].map(({ field, label, type }) => (
            <div key={field}>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">{label}</label>
              <input
                type={type}
                value={(form as Record<string, string | number | string[]>)[field] as string | number}
                onChange={(e) => setForm({ ...form, [field]: type === "number" ? Number(e.target.value) : e.target.value })}
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Design, Branding, UI/UX"
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
            />
          </div>
          <button onClick={handleSave} disabled={saving} className="w-full bg-[#24eda2] hover:bg-[#1dd48f] text-black font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 mt-2">
            {saving ? "Saving…" : editing ? "Save Changes" : "Create Service"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
