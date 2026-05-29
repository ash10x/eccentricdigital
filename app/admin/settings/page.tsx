"use client";

import { useEffect, useState } from "react";
import Modal from "../components/Modal";

interface SiteSetting { id: number; key: string; value: string }
interface SocialLink { id: number; platform: string; url: string; displayOrder: number }

const emptyLink = { platform: "", url: "", displayOrder: 0 };

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [linkForm, setLinkForm] = useState({ ...emptyLink });
  const [savingLink, setSavingLink] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const [s, l] = await Promise.all([
      fetch("/api/admin/site-settings").then((r) => r.json()),
      fetch("/api/admin/social-links").then((r) => r.json()),
    ]);
    setSettings(s);
    setSocials(l);
    setLoading(false);
  }

  async function saveSetting(key: string, value: string) {
    setSavingKey(key);
    await fetch("/api/admin/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setSettings((prev) => prev.map((s) => s.key === key ? { ...s, value } : s));
    setEditingKey(null);
    setSavingKey(null);
  }

  function openNewLink() {
    setEditingLink(null);
    setLinkForm({ ...emptyLink });
    setModal(true);
  }

  function openEditLink(link: SocialLink) {
    setEditingLink(link);
    setLinkForm({ platform: link.platform, url: link.url, displayOrder: link.displayOrder });
    setModal(true);
  }

  async function saveLink() {
    setSavingLink(true);
    if (editingLink) {
      await fetch(`/api/admin/social-links/${editingLink.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(linkForm),
      });
    } else {
      await fetch("/api/admin/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(linkForm),
      });
    }
    await fetchAll();
    setModal(false);
    setSavingLink(false);
  }

  async function deleteLink(id: number) {
    if (!confirm("Delete this social link?")) return;
    await fetch(`/api/admin/social-links/${id}`, { method: "DELETE" });
    setSocials((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-0.5">Site configuration &amp; social links</p>
      </div>

      {loading ? (
        <div className="text-white/30 text-sm py-16 text-center">Loading…</div>
      ) : (
        <div className="space-y-8">
          {/* Site Settings */}
          <div className="bg-[#0d0d0d] border border-white/8 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <h2 className="text-white font-semibold text-sm">Site Settings</h2>
            </div>
            <div className="divide-y divide-white/5">
              {settings.map((setting) => (
                <div key={setting.key} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{setting.key}</p>
                      {editingKey === setting.key ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            autoFocus
                            className="flex-1 bg-[#111] border border-[#24eda2]/30 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none"
                          />
                          <button
                            onClick={() => saveSetting(setting.key, editingValue)}
                            disabled={savingKey === setting.key}
                            className="bg-[#24eda2] hover:bg-[#1dd48f] text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {savingKey === setting.key ? "…" : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingKey(null)}
                            className="text-white/40 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="text-white/80 text-sm truncate">{setting.value}</p>
                      )}
                    </div>
                    {editingKey !== setting.key && (
                      <button
                        onClick={() => { setEditingKey(setting.key); setEditingValue(setting.value); }}
                        className="text-white/30 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/5 transition-all shrink-0"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-[#0d0d0d] border border-white/8 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-white font-semibold text-sm">Social Links</h2>
              <button onClick={openNewLink} className="bg-[#24eda2] hover:bg-[#1dd48f] text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                + Add
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Platform", "URL", "Order", ""].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {socials.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-8 text-white/30 text-sm">No social links yet</td></tr>
                )}
                {socials.map((link) => (
                  <tr key={link.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3 text-white capitalize font-medium">{link.platform}</td>
                    <td className="px-5 py-3">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[#24eda2]/70 hover:text-[#24eda2] text-xs truncate max-w-[220px] block transition-colors">
                        {link.url}
                      </a>
                    </td>
                    <td className="px-5 py-3 text-white/40 text-xs">{link.displayOrder}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEditLink(link)} className="text-white/40 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/5 transition-all">Edit</button>
                        <button onClick={() => deleteLink(link.id)} className="text-white/40 hover:text-red-400 text-xs px-2 py-1 rounded hover:bg-red-500/10 transition-all">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editingLink ? "Edit Social Link" : "New Social Link"}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Platform</label>
            <input
              type="text"
              value={linkForm.platform}
              onChange={(e) => setLinkForm({ ...linkForm, platform: e.target.value })}
              placeholder="instagram, twitter, linkedin…"
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">URL</label>
            <input
              type="url"
              value={linkForm.url}
              onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Display Order</label>
            <input
              type="number"
              value={linkForm.displayOrder}
              onChange={(e) => setLinkForm({ ...linkForm, displayOrder: Number(e.target.value) })}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
            />
          </div>
          <button onClick={saveLink} disabled={savingLink} className="w-full bg-[#24eda2] hover:bg-[#1dd48f] text-black font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 mt-2">
            {savingLink ? "Saving…" : editingLink ? "Save Changes" : "Add Link"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
