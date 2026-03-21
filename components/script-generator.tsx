"use client";

import { useState } from "react";
import { SupportedLanguage } from "@/lib/locale";

type Scenario = {
  id: string;
  title: string;
  slug: string;
};

type Props = {
  scenarios: Scenario[];
  defaultLanguage: SupportedLanguage;
  text: {
    aiScriptStudio: string;
    scenario: string;
    language: string;
    tone: string;
    audience: string;
    length: string;
    short: string;
    medium: string;
    long: string;
    formal: string;
    energetic: string;
    friendly: string;
    corporate: string;
    wedding: string;
    youth: string;
    community: string;
    generating: string;
    generateScript: string;
    output: string;
    scriptPlaceholder: string;
    eventContext: string;
    eventContextPlaceholder: string;
  };
};

export function ScriptGenerator({ scenarios, defaultLanguage, text }: Props) {
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/scripts/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    setScript(data.output);
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form action={handleSubmit} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
        <h2 className="font-display text-3xl text-white">{text.aiScriptStudio}</h2>
        <div className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">{text.scenario}</span>
            <select name="scenarioSlug" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white">
              {scenarios.map((scenario) => (
                <option key={scenario.id} value={scenario.slug}>
                  {scenario.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">{text.language}</span>
            <select name="language" defaultValue={defaultLanguage} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white">
              <option value="EN">English</option>
              <option value="FR">Francais</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">{text.tone}</span>
            <select name="tone" defaultValue="friendly" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white">
              <option value="formal">{text.formal}</option>
              <option value="energetic">{text.energetic}</option>
              <option value="friendly">{text.friendly}</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">{text.audience}</span>
            <select name="audience" defaultValue="corporate" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white">
              <option value="corporate">{text.corporate}</option>
              <option value="wedding">{text.wedding}</option>
              <option value="youth">{text.youth}</option>
              <option value="community">{text.community}</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">{text.length}</span>
            <select name="length" defaultValue="medium" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white">
              <option value="short">{text.short}</option>
              <option value="medium">{text.medium}</option>
              <option value="long">{text.long}</option>
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">{text.eventContext}</span>
            <textarea
              name="additionalContext"
              rows={6}
              placeholder={text.eventContextPlaceholder}
              className="w-full rounded-[1.5rem] border border-white/10 bg-black/30 px-4 py-3 text-white outline-none ring-gold/40 focus:ring"
            />
          </label>
          <button className="w-full rounded-full bg-gold px-6 py-3 font-medium text-black">{loading ? text.generating : text.generateScript}</button>
        </div>
      </form>
      <div className="rounded-[1.75rem] border border-white/10 bg-[#111111] p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">{text.output}</p>
        <pre className="mt-4 whitespace-pre-wrap font-body text-sm leading-7 text-zinc-200">
          {script || text.scriptPlaceholder}
        </pre>
      </div>
    </div>
  );
}
