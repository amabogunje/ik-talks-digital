"use client";

import { useEffect, useState } from "react";

type Scenario = {
  id: string;
  title: string;
  slug: string;
  description: string;
  guidance: string;
  active: boolean;
};

type Copy = {
  practiceWorkspaceTitle: string;
  practiceWorkspaceIntro: string;
  chooseScenario: string;
  createNewScenario: string;
  scenarioTitle: string;
  scenarioSlug: string;
  scenarioDescription: string;
  scenarioGuidance: string;
  scenarioActive: string;
  createScenario: string;
  updateScenario: string;
  deleteScenario: string;
  scenarioSaved: string;
  scenarioDeleted: string;
  scenarioSaveFailed: string;
  scenarioDeleteFailed: string;
  existingScenarios: string;
  existingScenariosIntro: string;
  activeBadge: string;
  inactiveBadge: string;
  resetForm: string;
};

type Props = {
  copy: Copy;
  scenarios: Scenario[];
};

type ScenarioForm = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  guidance: string;
  active: boolean;
};

function emptyScenario(): ScenarioForm {
  return {
    title: "",
    slug: "",
    description: "",
    guidance: "",
    active: true
  };
}

function scenarioToForm(scenario: Scenario | null): ScenarioForm {
  if (!scenario) return emptyScenario();
  return {
    id: scenario.id,
    title: scenario.title,
    slug: scenario.slug,
    description: scenario.description,
    guidance: scenario.guidance,
    active: scenario.active
  };
}

function upsertScenario(scenarios: Scenario[], nextScenario: Scenario) {
  const next = scenarios.some((scenario) => scenario.id === nextScenario.id)
    ? scenarios.map((scenario) => (scenario.id === nextScenario.id ? nextScenario : scenario))
    : [nextScenario, ...scenarios];

  return next.sort((a, b) => a.title.localeCompare(b.title));
}

export function AdminScenarioManager({ copy, scenarios: initialScenarios }: Props) {
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(initialScenarios[0]?.id ?? "new");
  const selectedScenario = scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? null;
  const [form, setForm] = useState<ScenarioForm>(() => scenarioToForm(selectedScenario));
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm(scenarioToForm(selectedScenario));
    setStatus("");
  }, [selectedScenarioId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("");

    const response = await fetch("/api/admin/scenarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus(data.error ?? copy.scenarioSaveFailed);
      setBusy(false);
      return;
    }

    const nextScenario = data.scenario as Scenario;
    setScenarios((current) => upsertScenario(current, nextScenario));
    setSelectedScenarioId(nextScenario.id);
    setForm(scenarioToForm(nextScenario));
    setStatus(copy.scenarioSaved);
    setBusy(false);
  }

  async function handleDelete() {
    if (!selectedScenario) return;
    setBusy(true);
    setStatus("");

    const response = await fetch("/api/admin/scenarios", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedScenario.id })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus(data.error ?? copy.scenarioDeleteFailed);
      setBusy(false);
      return;
    }

    const remaining = scenarios.filter((scenario) => scenario.id !== selectedScenario.id);
    setScenarios(remaining);
    setSelectedScenarioId(remaining[0]?.id ?? "new");
    setForm(emptyScenario());
    setStatus(copy.scenarioDeleted);
    setBusy(false);
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="section-title">{copy.practiceWorkspaceTitle}</h2>
        <p className="max-w-3xl text-sm leading-7 text-zinc-400">{copy.practiceWorkspaceIntro}</p>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{copy.chooseScenario}</p>
          <select value={selectedScenarioId} onChange={(event) => setSelectedScenarioId(event.target.value)} className="surface-input">
            <option value="new">{copy.createNewScenario}</option>
            {scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>{scenario.title}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.scenarioTitle}</span>
            <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="surface-input" required />
          </div>
          <div className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.scenarioSlug}</span>
            <input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} className="surface-input" required />
          </div>
          <div className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.scenarioDescription}</span>
            <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="surface-input min-h-28 resize-y" required />
          </div>
          <div className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.scenarioGuidance}</span>
            <textarea value={form.guidance} onChange={(event) => setForm((current) => ({ ...current, guidance: event.target.value }))} className="surface-input min-h-32 resize-y" required />
          </div>
          <label className="flex items-center gap-3 rounded-[0.8rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200">
            <input type="checkbox" checked={form.active} onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))} className="h-4 w-4 accent-yellow-400" />
            <span>{copy.scenarioActive}</span>
          </label>

          <div className="flex flex-wrap gap-3">
            <button className="button-primary px-5" disabled={busy}>{form.id ? copy.updateScenario : copy.createScenario}</button>
            <button type="button" className="button-secondary px-5" onClick={() => { setSelectedScenarioId("new"); setForm(emptyScenario()); }}>{copy.resetForm}</button>
            {form.id ? <button type="button" className="button-secondary px-5 text-red-200 hover:border-red-300/40 hover:text-red-100" onClick={handleDelete} disabled={busy}>{copy.deleteScenario}</button> : null}
          </div>

          {status ? <p className="text-sm text-zinc-400">{status}</p> : null}
        </form>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <div className="space-y-2">
          <h3 className="font-display text-2xl text-white">{copy.existingScenarios}</h3>
          <p className="text-sm leading-6 text-zinc-400">{copy.existingScenariosIntro}</p>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {scenarios.map((scenario) => (
            <button key={scenario.id} type="button" onClick={() => setSelectedScenarioId(scenario.id)} className={`rounded-[0.9rem] border px-4 py-4 text-left transition ${selectedScenarioId === scenario.id ? "border-gold/30 bg-gold/10" : "border-white/10 bg-black/20 hover:border-white/20"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base text-white">{scenario.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">{scenario.slug}</p>
                </div>
                <span className={`rounded-[0.55rem] border px-2 py-1 text-[11px] uppercase tracking-[0.18em] ${scenario.active ? "border-gold/20 bg-gold/10 text-gold" : "border-white/10 text-zinc-400"}`}>{scenario.active ? copy.activeBadge : copy.inactiveBadge}</span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">{scenario.description}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
