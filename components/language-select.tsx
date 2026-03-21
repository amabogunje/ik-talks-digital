"use client";

import { useTransition } from "react";
import { Language } from "@prisma/client";

export function LanguageSelect({ value }: { value: Language }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={value === "FR" ? "FR" : "EN"}
      disabled={isPending}
      aria-label="Select language"
      className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white outline-none ring-gold/40 focus:ring disabled:opacity-60"
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
