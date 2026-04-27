"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { createNewUser, saveAccountToRegistry } from "@/lib/auth";
import { LogoWordmark } from "@/components/ui/logo";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(user.verified ? "/dashboard" : "/onboarding");
    }
  }, [user, loading, router]);

  if (loading) return null;

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) { setError("Please enter your full name."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords don't match."); return; }

    setSubmitting(true);
    setTimeout(() => {
      const newUser = createNewUser(form.name, form.email);
      saveAccountToRegistry({ user: newUser, password: form.password });
      login(newUser);
      router.replace("/onboarding");
    }, 600);
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex justify-center">
        <LogoWordmark />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <h1 className="text-xl font-bold text-zinc-100 mb-1">Create account</h1>
        <p className="text-sm text-zinc-500 mb-6">Start managing your properties today.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={set("name")}
              placeholder="Marco Rossi"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all placeholder:text-zinc-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all placeholder:text-zinc-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={set("password")}
                placeholder="min. 6 chars"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all placeholder:text-zinc-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Confirm</label>
              <input
                type="password"
                required
                value={form.confirm}
                onChange={set("confirm")}
                placeholder="repeat"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-white text-zinc-950 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-60 mt-2"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-zinc-500 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-zinc-300 font-medium hover:text-white transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
