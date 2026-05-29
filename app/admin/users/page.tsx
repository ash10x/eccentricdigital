"use client";

import { useEffect, useState } from "react";
import Modal from "../components/Modal";

interface AdminUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

const emptyForm = {
  name: "",
  username: "",
  email: "",
  password: "",
  role: "admin",
  isActive: true,
};

const roleStyle: Record<string, string> = {
  super_admin: "text-[#24eda2] bg-[#24eda2]/10",
  admin: "text-[#00a3f8] bg-[#00a3f8]/10",
};

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const letters = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : name.slice(0, 2);
  return (
    <div className="w-8 h-8 rounded-full bg-[#24eda2]/10 border border-[#24eda2]/20 flex items-center justify-center text-[#24eda2] text-xs font-bold uppercase flex-shrink-0">
      {letters}
    </div>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number>(0);

  // Create / Edit modal
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Reset password modal
  const [pwModal, setPwModal] = useState(false);
  const [pwTarget, setPwTarget] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    fetchUsers();
    fetch("/api/admin/auth/me")
      .then((r) => r.json())
      .then((d) => setCurrentUserId(d.userId ?? 0));
  }, []);

  async function fetchUsers() {
    const res = await fetch("/api/admin/users");
    setUsers(await res.json());
    setLoading(false);
  }

  function openNew() {
    setEditing(null);
    setForm({ ...emptyForm });
    setFormError("");
    setModal(true);
  }

  function openEdit(user: AdminUser) {
    setEditing(user);
    setForm({
      name: user.name,
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
      isActive: user.isActive,
    });
    setFormError("");
    setModal(true);
  }

  async function handleSave() {
    setFormError("");
    if (!form.name || !form.username || !form.email) {
      setFormError("Name, username, and email are required.");
      return;
    }
    if (!editing && !form.password) {
      setFormError("Password is required for new users.");
      return;
    }

    setSaving(true);
    const res = editing
      ? await fetch(`/api/admin/users/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            username: form.username,
            email: form.email,
            role: form.role,
            isActive: form.isActive,
          }),
        })
      : await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

    if (!res.ok) {
      const data = await res.json();
      setFormError(data.error ?? "An error occurred.");
      setSaving(false);
      return;
    }

    await fetchUsers();
    setModal(false);
    setSaving(false);
  }

  async function handleDelete(user: AdminUser) {
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? "Could not delete user.");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
  }

  function openResetPassword(user: AdminUser) {
    setPwTarget(user);
    setNewPassword("");
    setConfirmPassword("");
    setPwError("");
    setPwModal(true);
  }

  async function handleResetPassword() {
    setPwError("");
    if (newPassword.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match.");
      return;
    }

    setPwSaving(true);
    const res = await fetch(`/api/admin/users/${pwTarget!.id}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });

    if (!res.ok) {
      const data = await res.json();
      setPwError(data.error ?? "An error occurred.");
      setPwSaving(false);
      return;
    }

    setPwModal(false);
    setPwSaving(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-white/40 text-sm mt-0.5">Admin account management</p>
        </div>
        <button
          onClick={openNew}
          className="bg-[#24eda2] hover:bg-[#1dd48f] text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + New User
        </button>
      </div>

      {loading ? (
        <div className="text-white/30 text-sm py-16 text-center">Loading…</div>
      ) : users.length === 0 ? (
        <div className="bg-[#0d0d0d] border border-white/8 rounded-xl p-12 text-center">
          <p className="text-white/30 text-sm mb-1">No admin users in database</p>
          <p className="text-white/20 text-xs">The env-var credentials are still active. Create a DB user to switch to database-managed authentication.</p>
        </div>
      ) : (
        <div className="bg-[#0d0d0d] border border-white/8 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["User", "Username", "Email", "Role", "Status", "Last Login", "Created", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-white/30 text-xs uppercase tracking-wider font-normal whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = user.id === currentUserId;
                const rs = roleStyle[user.role] ?? "text-white/50 bg-white/5";
                return (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Initials name={user.name} />
                        <span className="text-white font-medium">
                          {user.name}
                          {isSelf && (
                            <span className="ml-2 text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded-full">
                              you
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-white/60 font-mono text-xs">{user.username}</td>
                    <td className="px-5 py-3 text-white/60 text-xs">{user.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${rs}`}>
                        {user.role === "super_admin" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${user.isActive ? "text-emerald-400 bg-emerald-500/10" : "text-white/30 bg-white/5"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white/40 text-xs whitespace-nowrap">{formatDate(user.lastLoginAt)}</td>
                    <td className="px-5 py-3 text-white/30 text-xs whitespace-nowrap">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(user)}
                          className="text-white/40 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/5 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openResetPassword(user)}
                          className="text-white/40 hover:text-[#00a3f8] text-xs px-2 py-1 rounded hover:bg-[#00a3f8]/10 transition-all"
                        >
                          Reset PW
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={isSelf}
                          className="text-white/40 hover:text-red-400 text-xs px-2 py-1 rounded hover:bg-red-500/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Env-var notice */}
      <div className="mt-6 bg-[#0d0d0d] border border-white/5 rounded-xl px-5 py-4">
        <p className="text-white/30 text-xs leading-relaxed">
          <span className="text-white/50 font-medium">Env-var fallback:</span> If no matching username is found in the database, login falls back to{" "}
          <code className="bg-white/5 px-1 rounded text-white/40">ADMIN_USERNAME</code> /{" "}
          <code className="bg-white/5 px-1 rounded text-white/40">ADMIN_PASSWORD</code> in{" "}
          <code className="bg-white/5 px-1 rounded text-white/40">.env.local</code>.
          Create a DB user to migrate away from env-var credentials.
        </p>
      </div>

      {/* Create / Edit modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? `Edit — ${editing.username}` : "New Admin User"}>
        <div className="space-y-4">
          {[
            { field: "name", label: "Full Name", type: "text", placeholder: "Rodique Orlandi" },
            { field: "username", label: "Username", type: "text", placeholder: "rodique" },
            { field: "email", label: "Email", type: "email", placeholder: "admin@eccentricdigital.com" },
          ].map(({ field, label, type, placeholder }) => (
            <div key={field}>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">{label}</label>
              <input
                type={type}
                value={(form as Record<string, string | boolean>)[field] as string}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                placeholder={placeholder}
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
              />
            </div>
          ))}

          {!editing && (
            <div>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 8 characters"
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          {editing && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 accent-[#24eda2]"
              />
              <span className="text-sm text-white/70">Active (can log in)</span>
            </label>
          )}

          {formError && (
            <p className="text-red-400 text-sm">{formError}</p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#24eda2] hover:bg-[#1dd48f] text-black font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 mt-2"
          >
            {saving ? "Saving…" : editing ? "Save Changes" : "Create User"}
          </button>
        </div>
      </Modal>

      {/* Reset Password modal */}
      <Modal open={pwModal} onClose={() => setPwModal(false)} title={`Reset Password — ${pwTarget?.username}`}>
        <div className="space-y-4">
          <p className="text-white/40 text-sm">Set a new password for this account. The user will need to use it on their next login.</p>

          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
            />
          </div>

          {pwError && <p className="text-red-400 text-sm">{pwError}</p>}

          <button
            onClick={handleResetPassword}
            disabled={pwSaving}
            className="w-full bg-[#24eda2] hover:bg-[#1dd48f] text-black font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 mt-2"
          >
            {pwSaving ? "Updating…" : "Update Password"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
