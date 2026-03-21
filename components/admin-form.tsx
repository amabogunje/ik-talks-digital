"use client";

import { useState } from "react";

type Props = {
  action: "/api/admin/courses" | "/api/admin/scenarios" | "/api/admin/templates";
  fields: Array<{ name: string; label: string; type?: string }>;
  title: string;
  text: {
    save: string;
    savedSuccessfully: string;
    unableToSave: string;
  };
};

export function AdminForm({ action, fields, title, text }: Props) {
  const [status, setStatus] = useState("");

  async function handleSubmit(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch(action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setStatus(response.ok ? text.savedSuccessfully : text.unableToSave);
    if (response.ok) window.location.reload();
  }

  return (
    <form action={handleSubmit} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
      <h3 className="font-display text-2xl text-white">{title}</h3>
      <div className="mt-4 space-y-3">
        {fields.map((field) => (
          <label key={field.name} className="block space-y-2">
            <span className="text-sm text-zinc-300">{field.label}</span>
            <input name={field.name} type={field.type ?? "text"} required className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white" />
          </label>
        ))}
      </div>
      <button className="mt-4 rounded-full bg-gold px-5 py-3 font-medium text-black">{text.save}</button>
      {status ? <p className="mt-3 text-sm text-zinc-400">{status}</p> : null}
    </form>
  );
}
