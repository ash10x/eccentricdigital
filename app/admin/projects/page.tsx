"use client";

import { useEffect, useState } from "react";
import Modal from "../components/Modal";

interface Project {
  id: number;
  title: string;
  imageUrl: string;
  siteUrl: string;
  displayOrder: number;
}

const empty: Omit<Project, "id"> = { title: "", imageUrl: "", siteUrl: "", displayOrder: 0 };

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch("/api/admin/projects");
    setItems(await res.json());
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm({ ...empty });
    setModal(true);
  }

  function openEdit(item: Project) {
    setEditing(item);
    setForm({ title: item.title, imageUrl: item.imageUrl, siteUrl: item.siteUrl, displayOrder: item.displayOrder });
    setModal(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editing) {
      await fetch(`/api/admin/projects/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    await fetchData();
    setModal(false);
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-white/40 text-sm mt-0.5">Portfolio case studies</p>
        </div>
        <button onClick={openNew} className="bg-[#24eda2] hover:bg-[#1dd48f] text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          + New Project
        </button>
      </div>

      {loading ? (
        <div className="text-white/30 text-sm py-16 text-center">Loading…</div>
      ) : (
        <div className="bg-[#0d0d0d] border border-white/8 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["#", "Title", "Site URL", "Image", "Order", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-white/30">No projects yet</td></tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3 text-white/30 text-xs">{item.id}</td>
                  <td className="px-5 py-3 text-white font-medium">{item.title}</td>
                  <td className="px-5 py-3">
                    <a href={item.siteUrl} target="_blank" rel="noopener noreferrer" className="text-[#24eda2]/70 hover:text-[#24eda2] text-xs truncate max-w-[180px] block transition-colors">
                      {item.siteUrl}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-white/40 text-xs truncate max-w-[120px]">{item.imageUrl}</td>
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

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Project" : "New Project"}>
        <div className="space-y-4">
          {[
            { field: "title", label: "Title", type: "text" },
            { field: "imageUrl", label: "Image URL", type: "text" },
            { field: "siteUrl", label: "Site URL", type: "text" },
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
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#24eda2] hover:bg-[#1dd48f] text-black font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 mt-2"
          >
            {saving ? "Saving…" : editing ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
