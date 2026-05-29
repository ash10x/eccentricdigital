"use client";

import { useEffect, useState } from "react";
import Modal from "../components/Modal";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
  displayOrder: number;
}

const empty = { name: "", role: "", imageUrl: "", displayOrder: 0 };

export default function TeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch("/api/admin/team");
    setItems(await res.json());
    setLoading(false);
  }

  function openNew() { setEditing(null); setForm({ ...empty }); setModal(true); }

  function openEdit(item: TeamMember) {
    setEditing(item);
    setForm({ name: item.name, role: item.role, imageUrl: item.imageUrl, displayOrder: item.displayOrder });
    setModal(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editing) {
      await fetch(`/api/admin/team/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/admin/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    await fetchData();
    setModal(false);
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Remove this team member?")) return;
    await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="text-white/40 text-sm mt-0.5">Team members</p>
        </div>
        <button onClick={openNew} className="bg-[#24eda2] hover:bg-[#1dd48f] text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + Add Member
        </button>
      </div>

      {loading ? (
        <div className="text-white/30 text-sm py-16 text-center">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.length === 0 && (
            <p className="text-white/30 text-sm col-span-3 py-12 text-center">No team members yet</p>
          )}
          {items.map((item) => (
            <div key={item.id} className="bg-[#0d0d0d] border border-white/8 rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#111] overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-lg">⊕</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{item.name}</p>
                <p className="text-white/40 text-xs truncate">{item.role}</p>
                <p className="text-white/20 text-xs mt-0.5">Order: {item.displayOrder}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <button onClick={() => openEdit(item)} className="text-white/40 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/5 transition-all">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-white/40 hover:text-red-400 text-xs px-2 py-1 rounded hover:bg-red-500/10 transition-all">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Member" : "Add Team Member"}>
        <div className="space-y-4">
          {[
            { field: "name", label: "Name", type: "text" },
            { field: "role", label: "Role / Title", type: "text" },
            { field: "imageUrl", label: "Image URL", type: "text" },
            { field: "displayOrder", label: "Display Order", type: "number" },
          ].map(({ field, label, type }) => (
            <div key={field}>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">{label}</label>
              <input
                type={type}
                value={(form as Record<string, string | number>)[field]}
                onChange={(e) => setForm({ ...form, [field]: type === "number" ? Number(e.target.value) : e.target.value })}
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
              />
            </div>
          ))}
          <button onClick={handleSave} disabled={saving} className="w-full bg-[#24eda2] hover:bg-[#1dd48f] text-black font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 mt-2">
            {saving ? "Saving…" : editing ? "Save Changes" : "Add Member"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
