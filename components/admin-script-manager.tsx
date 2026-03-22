"use client";

import { useEffect, useState } from "react";

type ScenarioOption = {
  id: string;
  title: string;
  slug: string;
};

type ScriptTemplate = {
  id: string;
  scenarioId: string;
  language: string;
  tone: string;
  audience: string;
  template: string;
  scenario: ScenarioOption;
};

type Copy = {
  scriptWorkspaceTitle: string;
  scriptWorkspaceIntro: string;
  chooseTemplate: string;
  createNewTemplate: string;
  scriptScenario: string;
  scriptLanguage: string;
  scriptTone: string;
  scriptAudience: string;
  scriptTemplateBody: string;
  createTemplate: string;
  updateTemplate: string;
  deleteTemplate: string;
  templateSaved: string;
  templateDeleted: string;
  templateSaveFailed: string;
  templateDeleteFailed: string;
  existingTemplates: string;
  existingTemplatesIntro: string;
  resetForm: string;
};

type Props = {
  copy: Copy;
  templates: ScriptTemplate[];
  scenarios: ScenarioOption[];
};

type TemplateForm = {
  id?: string;
  scenarioId: string;
  language: string;
  tone: string;
  audience: string;
  template: string;
};

function emptyTemplate(scenarios: ScenarioOption[]): TemplateForm {
  return {
    scenarioId: scenarios[0]?.id ?? "",
    language: "EN",
    tone: "formal",
    audience: "general",
    template: ""
  };
}

function templateToForm(item: ScriptTemplate | null, scenarios: ScenarioOption[]): TemplateForm {
  if (!item) return emptyTemplate(scenarios);
  return {
    id: item.id,
    scenarioId: item.scenarioId,
    language: item.language,
    tone: item.tone,
    audience: item.audience,
    template: item.template
  };
}

function upsertTemplate(items: ScriptTemplate[], nextItem: ScriptTemplate) {
  const next = items.some((item) => item.id === nextItem.id)
    ? items.map((item) => (item.id === nextItem.id ? nextItem : item))
    : [nextItem, ...items];

  return next.sort((a, b) => a.scenario.title.localeCompare(b.scenario.title) || a.language.localeCompare(b.language) || a.tone.localeCompare(b.tone));
}

export function AdminScriptManager({ copy, templates: initialTemplates, scenarios }: Props) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialTemplates[0]?.id ?? "new");
  const selectedTemplate = templates.find((item) => item.id === selectedTemplateId) ?? null;
  const [form, setForm] = useState<TemplateForm>(() => templateToForm(selectedTemplate, scenarios));
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm(templateToForm(selectedTemplate, scenarios));
    setStatus("");
  }, [selectedTemplateId, scenarios]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("");

    const response = await fetch("/api/admin/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus(data.error ?? copy.templateSaveFailed);
      setBusy(false);
      return;
    }

    const nextItem = data.item as ScriptTemplate;
    setTemplates((current) => upsertTemplate(current, nextItem));
    setSelectedTemplateId(nextItem.id);
    setForm(templateToForm(nextItem, scenarios));
    setStatus(copy.templateSaved);
    setBusy(false);
  }

  async function handleDelete() {
    if (!selectedTemplate) return;
    setBusy(true);
    setStatus("");

    const response = await fetch("/api/admin/templates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedTemplate.id })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus(data.error ?? copy.templateDeleteFailed);
      setBusy(false);
      return;
    }

    const remaining = templates.filter((item) => item.id !== selectedTemplate.id);
    setTemplates(remaining);
    setSelectedTemplateId(remaining[0]?.id ?? "new");
    setForm(emptyTemplate(scenarios));
    setStatus(copy.templateDeleted);
    setBusy(false);
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="section-title">{copy.scriptWorkspaceTitle}</h2>
        <p className="max-w-3xl text-sm leading-7 text-zinc-400">{copy.scriptWorkspaceIntro}</p>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{copy.chooseTemplate}</p>
          <select value={selectedTemplateId} onChange={(event) => setSelectedTemplateId(event.target.value)} className="surface-input">
            <option value="new">{copy.createNewTemplate}</option>
            {templates.map((item) => (
              <option key={item.id} value={item.id}>{item.scenario.title} · {item.language} · {item.tone}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-zinc-300">{copy.scriptScenario}</span>
              <select value={form.scenarioId} onChange={(event) => setForm((current) => ({ ...current, scenarioId: event.target.value }))} className="surface-input">
                {scenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>{scenario.title}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm text-zinc-300">{copy.scriptLanguage}</span>
              <select value={form.language} onChange={(event) => setForm((current) => ({ ...current, language: event.target.value }))} className="surface-input">
                <option value="EN">English</option>
                <option value="FR">Francais</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-zinc-300">{copy.scriptTone}</span>
              <input value={form.tone} onChange={(event) => setForm((current) => ({ ...current, tone: event.target.value }))} className="surface-input" required />
            </label>
            <label className="space-y-2">
              <span className="text-sm text-zinc-300">{copy.scriptAudience}</span>
              <input value={form.audience} onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))} className="surface-input" required />
            </label>
          </div>

          <div className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.scriptTemplateBody}</span>
            <textarea value={form.template} onChange={(event) => setForm((current) => ({ ...current, template: event.target.value }))} className="surface-input min-h-40 resize-y" required />
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="button-primary px-5" disabled={busy}>{form.id ? copy.updateTemplate : copy.createTemplate}</button>
            <button type="button" className="button-secondary px-5" onClick={() => { setSelectedTemplateId("new"); setForm(emptyTemplate(scenarios)); }}>{copy.resetForm}</button>
            {form.id ? <button type="button" className="button-secondary px-5 text-red-200 hover:border-red-300/40 hover:text-red-100" onClick={handleDelete} disabled={busy}>{copy.deleteTemplate}</button> : null}
          </div>

          {status ? <p className="text-sm text-zinc-400">{status}</p> : null}
        </form>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <div className="space-y-2">
          <h3 className="font-display text-2xl text-white">{copy.existingTemplates}</h3>
          <p className="text-sm leading-6 text-zinc-400">{copy.existingTemplatesIntro}</p>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {templates.map((item) => (
            <button key={item.id} type="button" onClick={() => setSelectedTemplateId(item.id)} className={`rounded-[0.9rem] border px-4 py-4 text-left transition ${selectedTemplateId === item.id ? "border-gold/30 bg-gold/10" : "border-white/10 bg-black/20 hover:border-white/20"}`}>
              <p className="text-base text-white">{item.scenario.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">{item.language} · {item.tone} · {item.audience}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">{item.template}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
