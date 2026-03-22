"use client";

import { useTransition } from "react";
import { Language } from "@prisma/client";

export function LanguageSelect({ value, compact = false }: { value: Language; compact?: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={value === "FR" ? "FR" : "EN"}
      disabled={isPending}
      aria-label="Select language"
      className={`rounded-full border border-white/10 bg-[rgba(40,40,40,0.92)] text-sm text-white outline-none ring-gold/40 focus:ring disabled:opacity-60 ${compact ? "min-w-[7.25rem] px-3 py-2" : "min-w-[8.5rem] px-4 py-2"}`}
      onChange={(event) =>
        startTransition(async () => {
          await fetch("/api/profile/language", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language: event.target.value })
          });
          window.location.reload();
        })
      }
    >
      <option value="EN">English</option>
      <option value="FR">Francais</option>
    </select>
  );
}
