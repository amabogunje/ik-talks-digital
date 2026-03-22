"use client";

import { useState } from "react";
import { SupportedLanguage } from "@/lib/locale";

type Scenario = {
  id: string;
  title: string;
  slug: string;
};

type SavedScript = {
  id: string;
  title: string;
  scenarioId: string;
  scenarioSlug: string;
  scenarioTitle: string;
  language: string;
  tone: string;
  audience: string;
  length: string;
  output: string;
  createdAt: string;
};

type Props = {
  scenarios: Scenario[];
  savedScripts: SavedScript[];
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
    savedScripts: string;
    savedScriptsIntro: string;
    noSavedScripts: string;
    delete: string;
    createdLabel: string;
    saveScript: string;
    clearOutput: string;
    scriptName: string;
    scriptNamePlaceholder: string;
    cancel: string;
    scenarioLabelShort: string;
  };
};

type FormState = {
  scenarioSlug: string;
  language: string;
  tone: string;
  audience: string;
  length: string;
  additionalContext: string;
};

type GeneratedScriptMeta = {
  scenarioSlug: string;
  scenarioTitle: string;
  language: string;
  tone: string;
  audience: string;
  length: string;
};

export function ScriptGenerator({ scenarios, savedScripts: initialSavedScripts, defaultLanguage, text }: Props) {
  const [savedScripts, setSavedScripts] = useState(initialSavedScripts);
  const [script, setScript] = useState(initialSavedScripts[0]?.output ?? "");
  const [selectedScriptId, setSelectedScriptId] = useState(initialSavedScripts[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveName, setSaveName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [generatedMeta, setGeneratedMeta] = useState<GeneratedScriptMeta | null>(null);
  const [form, setForm] = useState<FormState>({
    scenarioSlug: scenarios[0]?.slug ?? "",
    language: defaultLanguage,
    tone: "friendly",
    audience: "corporate",
    length: "medium",
    additionalContext: ""
  });

  function formatDate(value: string) {
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/scripts/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error ?? text.scriptPlaceholder);
      setLoading(false);
      return;
    }

    setScript(data.output);
    setSelectedScriptId("");
    setGeneratedMeta({
      scenarioSlug: form.scenarioSlug,
      scenarioTitle: data.scenario?.title ?? scenarios.find((scenario) => scenario.slug === form.scenarioSlug)?.title ?? text.scenario,
      language: form.language,
      tone: form.tone,
      audience: form.audience,
      length: form.length
    });
    setLoading(false);
  }

  async function handleSaveScript() {
    if (!generatedMeta) return;
    setSaving(true);
    setError("");

    const response = await fetch("/api/scripts/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: saveName,
        scenarioSlug: generatedMeta.scenarioSlug,
        language: generatedMeta.language,
        tone: generatedMeta.tone,
        audience: generatedMeta.audience,
        length: generatedMeta.length,
        output: script
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error ?? text.scriptPlaceholder);
      setSaving(false);
      return;
    }

    const nextSaved = {
      id: data.savedRequest.id,
      title: data.savedRequest.title ?? data.savedRequest.scenario.title,
      scenarioId: data.savedRequest.scenarioId,
      scenarioSlug: data.savedRequest.scenario.slug,
      scenarioTitle: data.savedRequest.scenario.title,
      language: data.savedRequest.language,
      tone: data.savedRequest.tone,
      audience: data.savedRequest.audience,
      length: data.savedRequest.length,
      output: data.savedRequest.output,
      createdAt: data.savedRequest.createdAt
    } satisfies SavedScript;

    setSavedScripts((current) => [nextSaved, ...current.filter((item) => item.id !== nextSaved.id)].slice(0, 12));
    setSelectedScriptId(nextSaved.id);
    setGeneratedMeta(null);
    setShowSaveModal(false);
    setSaveName("");
    setSaving(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const response = await fetch(`/api/scripts/history/${id}`, { method: "DELETE" });
    if (response.ok) {
      const remaining = savedScripts.filter((item) => item.id !== id);
      setSavedScripts(remaining);
      if (selectedScriptId === id) {
        setSelectedScriptId("");
      }
    }
    setDeletingId("");
  }

  function handleRowClick(item: SavedScript) {
    setSelectedScriptId(item.id);
    setScript(item.output);
    setGeneratedMeta(null);
  }

  function handleClearOutput() {
    setScript("");
    setGeneratedMeta(null);
    setSelectedScriptId("");
    setError("");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="surface-card p-5 sm:p-6">
          <h2 className="font-display text-2xl text-white sm:text-3xl">{text.aiScriptStudio}</h2>
          <div className="mt-5 space-y-4 sm:mt-6">
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">{text.scenario}</span>
              <select value={form.scenarioSlug} onChange={(event) => setForm((current) => ({ ...current, scenarioSlug: event.target.value }))} className="surface-input">
                {scenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.slug}>
                    {scenario.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">{text.language}</span>
                <select value={form.language} onChange={(event) => setForm((current) => ({ ...current, language: event.target.value }))} className="surface-input">
                  <option value="EN">English</option>
                  <option value="FR">Francais</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">{text.tone}</span>
                <select value={form.tone} onChange={(event) => setForm((current) => ({ ...current, tone: event.target.value }))} className="surface-input">
                  <option value="formal">{text.formal}</option>
                  <option value="energetic">{text.energetic}</option>
                  <option value="friendly">{text.friendly}</option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">{text.audience}</span>
                <select value={form.audience} onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))} className="surface-input">
                  <option value="corporate">{text.corporate}</option>
                  <option value="wedding">{text.wedding}</option>
                  <option value="youth">{text.youth}</option>
                  <option value="community">{text.community}</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">{text.length}</span>
                <select value={form.length} onChange={(event) => setForm((current) => ({ ...current, length: event.target.value }))} className="surface-input">
                  <option value="short">{text.short}</option>
                  <option value="medium">{text.medium}</option>
                  <option value="long">{text.long}</option>
                </select>
              </label>
            </div>
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">{text.eventContext}</span>
              <textarea
                value={form.additionalContext}
                onChange={(event) => setForm((current) => ({ ...current, additionalContext: event.target.value }))}
                rows={6}
                placeholder={text.eventContextPlaceholder}
                className="surface-input rounded-[0.95rem]"
              />
            </label>
            <button className="button-primary w-full">{loading ? text.generating : text.generateScript}</button>
            {error ? <p className="text-sm text-red-200">{error}</p> : null}
          </div>
        </form>
        <div className="surface-card p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-gold sm:text-sm">{text.output}</p>
          <textarea
            value={script}
            onChange={(event) => setScript(event.target.value)}
            placeholder={text.scriptPlaceholder}
            className="mt-4 min-h-[420px] w-full resize-y rounded-[0.95rem] border border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-zinc-200 outline-none transition focus:border-gold/30 focus:ring-1 focus:ring-gold/20"
          />
          {script.trim() ? (
            <div className="mt-5 border-t border-white/10 pt-4">
              <div className="flex flex-wrap gap-3">
                {generatedMeta ? <button type="button" onClick={() => { setSaveName(generatedMeta.scenarioTitle); setShowSaveModal(true); }} className="button-secondary px-5">{text.saveScript}</button> : null}
                <button type="button" onClick={handleClearOutput} className="button-secondary px-5">{text.clearOutput}</button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <section className="surface-card p-5 sm:p-6">
        <div className="space-y-2">
          <h3 className="font-display text-2xl text-white">{text.savedScripts}</h3>
          <p className="text-sm leading-6 text-zinc-400">{text.savedScriptsIntro}</p>
        </div>

        {savedScripts.length ? (
          <div className="mt-5 overflow-hidden rounded-[0.95rem] border border-white/10">
            <div className="grid grid-cols-[minmax(0,1.4fr)_120px_140px_minmax(0,1fr)_90px] gap-3 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
              <span>{text.scriptName}</span>
              <span>{text.createdLabel}</span>
              <span>{text.scenarioLabelShort}</span>
              <span>{text.language} / {text.tone}</span>
              <span className="text-right">{text.delete}</span>
            </div>
            {savedScripts.map((item) => (
              <div key={item.id} className={`grid grid-cols-[minmax(0,1.4fr)_120px_140px_minmax(0,1fr)_90px] gap-3 border-t border-white/10 px-4 py-3 text-sm ${selectedScriptId === item.id ? "bg-gold/10" : "bg-black/10"}`}>
                <button type="button" onClick={() => handleRowClick(item)} className="truncate text-left text-white hover:text-gold">{item.title}</button>
                <button type="button" onClick={() => handleRowClick(item)} className="text-left text-zinc-400 hover:text-zinc-200">{formatDate(item.createdAt)}</button>
                <button type="button" onClick={() => handleRowClick(item)} className="truncate text-left text-zinc-400 hover:text-zinc-200">{item.scenarioTitle}</button>
                <button type="button" onClick={() => handleRowClick(item)} className="truncate text-left text-zinc-400 hover:text-zinc-200">{item.language} · {item.tone} · {item.audience}</button>
                <div className="text-right">
                  <button type="button" onClick={() => handleDelete(item.id)} className="text-sm text-red-200 hover:text-red-100" disabled={deletingId === item.id}>{deletingId === item.id ? `${text.delete}...` : text.delete}</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm leading-6 text-zinc-400">{text.noSavedScripts}</p>
        )}
      </section>

      {showSaveModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="surface-card w-full max-w-md p-5 sm:p-6">
            <h4 className="font-display text-2xl text-white">{text.saveScript}</h4>
            <div className="mt-4 space-y-2">
              <span className="text-sm text-zinc-300">{text.scriptName}</span>
              <input value={saveName} onChange={(event) => setSaveName(event.target.value)} placeholder={text.scriptNamePlaceholder} className="surface-input" />
            </div>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={handleSaveScript} className="button-primary px-5" disabled={saving}>{saving ? text.generating : text.saveScript}</button>
              <button type="button" onClick={() => setShowSaveModal(false)} className="button-secondary px-5">{text.cancel}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
