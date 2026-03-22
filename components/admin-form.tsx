"use client";

import { useState } from "react";

type FieldOption = {
  label: string;
  value: string;
};

type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: FieldOption[];
};

type Props = {
  action: "/api/admin/courses" | "/api/admin/scenarios" | "/api/admin/templates";
  fields: Field[];
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
    fields.forEach((field) => {
      if (field.type === "checkbox" && !formData.has(field.name)) {
        payload[field.name] = "false";
      }
    });

    const response = await fetch(action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setStatus(response.ok ? text.savedSuccessfully : text.unableToSave);
    if (response.ok) window.location.reload();
  }

  function renderField(field: Field) {
    if (field.type === "textarea") {
      return <textarea name={field.name} required={field.required ?? true} className="surface-input min-h-28 resize-y" />;
    }

    if (field.type === "select") {
      return (
        <select name={field.name} required={field.required ?? true} className="surface-input">
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "checkbox") {
      return (
        <label className="flex items-center gap-3 rounded-[0.8rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200">
          <input name={field.name} type="checkbox" value="true" className="h-4 w-4 accent-yellow-400" />
          <span>{field.label}</span>
        </label>
      );
    }

    return <input name={field.name} type={field.type ?? "text"} required={field.required ?? true} className="surface-input" />;
  }

  return (
    <form action={handleSubmit} className="surface-card p-5">
      <h3 className="font-display text-2xl text-white">{title}</h3>
      <div className="mt-4 space-y-3">
        {fields.map((field) => (
          <div key={field.name} className="block space-y-2">
            {field.type === "checkbox" ? null : <span className="text-sm text-zinc-300">{field.label}</span>}
            {renderField(field)}
          </div>
        ))}
      </div>
      <button className="button-primary mt-4 px-5">{text.save}</button>
      {status ? <p className="mt-3 text-sm text-zinc-400">{status}</p> : null}
    </form>
  );
}