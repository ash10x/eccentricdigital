"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/eccentriclogo.png"
            alt="Eccentric Digital Logo"
            width={48}
            height={48}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-white/40 text-sm mt-1">Admin Access</p>
        </div>

        <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                autoComplete="username"
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
                className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#24eda2]/50 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#24eda2] hover:bg-[#1dd48f] text-black font-semibold py-3 rounded-lg text-sm transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
