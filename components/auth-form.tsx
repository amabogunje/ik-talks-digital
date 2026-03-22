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
    <form action={handleSubmit} className="surface-card space-y-5 p-6 sm:p-8">
      {mode === "signup" ? (
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">{text.fullName}</span>
          <input name="name" required className="surface-input" />
        </label>
      ) : null}
      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">{text.email}</span>
        <input name="email" type="email" required className="surface-input" />
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">{text.password}</span>
        <input name="password" type="password" required minLength={8} className="surface-input" />
      </label>
      {mode === "signup" ? (
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">{text.preferredLanguage}</span>
          <select name="language" defaultValue="EN" className="surface-input">
            <option value="EN">English</option>
            <option value="FR">Francais</option>
          </select>
        </label>
      ) : null}
      {error ? <p className="rounded-[0.85rem] bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
      <button className="button-primary w-full">
        {mode === "login" ? text.login : text.createAccountButton}
      </button>
      {mode === "login" ? <p className="text-sm text-zinc-400">{text.demoLearner}: `ada@iktalks.africa` / `password123`</p> : <p className="text-sm text-zinc-400">{text.guidedDashboard}</p>}
    </form>
  );
}
