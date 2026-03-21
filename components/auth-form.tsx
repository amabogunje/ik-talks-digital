"use client";

import { useState } from "react";

type Props = {
  mode: "login" | "signup";
  text: {
    fullName: string;
    email: string;
    password: string;
    preferredLanguage: string;
    createAccountButton: string;
    login: string;
    demoLearner: string;
    guidedDashboard: string;
    authError: string;
  };
};

export function AuthForm({ mode, text }: Props) {
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? text.authError);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <form action={handleSubmit} className="space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glow">
      {mode === "signup" ? (
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">{text.fullName}</span>
          <input name="name" required className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none ring-gold/40 focus:ring" />
        </label>
      ) : null}
      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">{text.email}</span>
        <input name="email" type="email" required className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none ring-gold/40 focus:ring" />
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">{text.password}</span>
        <input name="password" type="password" required minLength={8} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none ring-gold/40 focus:ring" />
      </label>
      {mode === "signup" ? (
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">{text.preferredLanguage}</span>
          <select name="language" defaultValue="EN" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none ring-gold/40 focus:ring">
            <option value="EN">English</option>
            <option value="FR">Francais</option>
          </select>
        </label>
      ) : null}
      {error ? <p className="rounded-2xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
      <button className="w-full rounded-full bg-gold px-6 py-3 font-medium text-black">
        {mode === "login" ? text.login : text.createAccountButton}
      </button>
      {mode === "login" ? <p className="text-sm text-zinc-400">{text.demoLearner}: `ada@iktalks.africa` / `password123`</p> : <p className="text-sm text-zinc-400">{text.guidedDashboard}</p>}
    </form>
  );
}
