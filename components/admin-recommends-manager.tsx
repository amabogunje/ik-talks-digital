"use client";

import { useEffect, useMemo, useState } from "react";

type ResourceItem = {
  id: string;
  titleEn: string;
  titleFr: string;
  source: string;
  contentType: string;
  category: string;
  summaryEn: string;
  summaryFr: string;
  ikNoteEn: string;
  ikNoteFr: string;
  estimatedLength: string;
  url: string;
  thumbnail: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

type Props = {
  resources: ResourceItem[];
  initialSelectedId?: string;
  copy: {
    title: string;
    chooser: string;
    newLabel: string;
    titleEn: string;
    titleFr: string;
    source: string;
    contentType: string;
    category: string;
    summaryEn: string;
    summaryFr: string;
    ikNoteEn: string;
    ikNoteFr: string;
    estimatedLength: string;
    url: string;
    thumbnail: string;
    featured: string;
    active: string;
    sortOrder: string;
    create: string;
    update: string;
    delete: string;
    reset: string;
    saved: string;
    failed: string;
    deleted: string;
    video: string;
    article: string;
    podcast: string;
    tool: string;
    presence: string;
    voice: string;
    storytelling: string;
    audience: string;
    hosting: string;
    business: string;
    existing: string;
  };
};

type FormState = {
  id: string;
  titleEn: string;
  titleFr: string;
  source: string;
  contentType: string;
  category: string;
  summaryEn: string;
  summaryFr: string;
  ikNoteEn: string;
  ikNoteFr: string;
  estimatedLength: string;
  url: string;
  thumbnail: string;
  featured: boolean;
  active: boolean;
  sortOrder: string;
};

function createBlankState(): FormState {
  return {
    id: "",
    titleEn: "",
    titleFr: "",
    source: "",
    contentType: "video",
    category: "presence-confidence",
    summaryEn: "",
    summaryFr: "",
    ikNoteEn: "",
    ikNoteFr: "",
    estimatedLength: "",
    url: "",
    thumbnail: "",
    featured: false,
    active: true,
    sortOrder: "0"
  };
}

export function AdminRecommendsManager({ resources, initialSelectedId = "", copy }: Props) {
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [form, setForm] = useState<FormState>(createBlankState());
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const options = useMemo(
    () => resources.map((resource) => ({ id: resource.id, label: `${resource.titleEn} (${resource.source})` })),
    [resources]
  );

  function loadResource(resourceId: string) {
    setSelectedId(resourceId);
    const resource = resources.find((item) => item.id === resourceId);
    if (!resource) {
      setForm(createBlankState());
      return;
    }

    setForm({
      id: resource.id,
      titleEn: resource.titleEn,
      titleFr: resource.titleFr,
      source: resource.source,
      contentType: resource.contentType,
      category: resource.category,
      summaryEn: resource.summaryEn,
      summaryFr: resource.summaryFr,
      ikNoteEn: resource.ikNoteEn,
      ikNoteFr: resource.ikNoteFr,
      estimatedLength: resource.estimatedLength,
      url: resource.url,
      thumbnail: resource.thumbnail,
      featured: resource.featured,
      active: resource.active,
      sortOrder: String(resource.sortOrder)
    });
  }

  useEffect(() => {
    if (initialSelectedId) {
      loadResource(initialSelectedId);
      return;
    }
    setSelectedId("");
    setForm(createBlankState());
  }, [initialSelectedId]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    const response = await fetch("/api/admin/recommends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        titleFr: form.titleFr || form.titleEn,
        summaryFr: form.summaryFr || form.summaryEn,
        ikNoteFr: form.ikNoteFr || form.ikNoteEn,
        sortOrder: Number(form.sortOrder) || 0
      })
    });

    setSaving(false);
    if (response.ok) {
      setStatus(copy.saved);
      window.location.reload();
      return;
    }

    setStatus(copy.failed);
  }

  async function handleDelete() {
    if (!form.id) return;

    setSaving(true);
    setStatus("");
    const response = await fetch(`/api/admin/recommends?id=${form.id}`, {
      method: "DELETE"
    });
    setSaving(false);

    if (response.ok) {
      setStatus(copy.deleted);
      window.location.reload();
      return;
    }

    setStatus(copy.failed);
  }

  return (
    <div className="surface-card p-5 sm:p-6">
      <div className="space-y-2">
        <h3 className="font-display text-2xl text-white">{copy.title}</h3>
        <p className="text-sm leading-6 text-zinc-400">{copy.existing}</p>
      </div>

      <div className="mt-5 space-y-2">
        <span className="text-sm text-zinc-300">{copy.chooser}</span>
        <select value={selectedId} onChange={(event) => loadResource(event.target.value)} className="surface-input">
          <option value="">{copy.newLabel}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>{option.label}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <div className="grid gap-3 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.titleEn}</span>
            <input value={form.titleEn} onChange={(event) => updateField("titleEn", event.target.value)} className="surface-input" required />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.titleFr}</span>
            <input value={form.titleFr} onChange={(event) => updateField("titleFr", event.target.value)} className="surface-input" />
          </label>
        </div>

        <div className="grid gap-3 lg:grid-cols-4">
          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-zinc-300">{copy.source}</span>
            <input value={form.source} onChange={(event) => updateField("source", event.target.value)} className="surface-input" required />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.contentType}</span>
            <select value={form.contentType} onChange={(event) => updateField("contentType", event.target.value)} className="surface-input">
              <option value="video">{copy.video}</option>
              <option value="article">{copy.article}</option>
              <option value="podcast">{copy.podcast}</option>
              <option value="tool">{copy.tool}</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.category}</span>
            <select value={form.category} onChange={(event) => updateField("category", event.target.value)} className="surface-input">
              <option value="presence-confidence">{copy.presence}</option>
              <option value="voice-delivery">{copy.voice}</option>
              <option value="storytelling-structure">{copy.storytelling}</option>
              <option value="audience-engagement">{copy.audience}</option>
              <option value="hosting-skills">{copy.hosting}</option>
              <option value="business-speaking">{copy.business}</option>
            </select>
          </label>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.summaryEn}</span>
            <textarea value={form.summaryEn} onChange={(event) => updateField("summaryEn", event.target.value)} className="surface-input min-h-28 resize-y" required />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.summaryFr}</span>
            <textarea value={form.summaryFr} onChange={(event) => updateField("summaryFr", event.target.value)} className="surface-input min-h-28 resize-y" />
          </label>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.ikNoteEn}</span>
            <textarea value={form.ikNoteEn} onChange={(event) => updateField("ikNoteEn", event.target.value)} className="surface-input min-h-28 resize-y" required />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.ikNoteFr}</span>
            <textarea value={form.ikNoteFr} onChange={(event) => updateField("ikNoteFr", event.target.value)} className="surface-input min-h-28 resize-y" />
          </label>
        </div>

        <div className="grid gap-3 lg:grid-cols-4">
          <label className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.estimatedLength}</span>
            <input value={form.estimatedLength} onChange={(event) => updateField("estimatedLength", event.target.value)} className="surface-input" required />
          </label>
          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm text-zinc-300">{copy.url}</span>
            <input value={form.url} onChange={(event) => updateField("url", event.target.value)} className="surface-input" required />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.sortOrder}</span>
            <input value={form.sortOrder} onChange={(event) => updateField("sortOrder", event.target.value)} className="surface-input" type="number" />
          </label>
        </div>

        <label className="space-y-2 block">
          <span className="text-sm text-zinc-300">{copy.thumbnail}</span>
          <input value={form.thumbnail} onChange={(event) => updateField("thumbnail", event.target.value)} className="surface-input" required />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-[0.8rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200">
            <input checked={form.featured} onChange={(event) => updateField("featured", event.target.checked)} type="checkbox" className="h-4 w-4 accent-yellow-400" />
            <span>{copy.featured}</span>
          </label>
          <label className="flex items-center gap-3 rounded-[0.8rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200">
            <input checked={form.active} onChange={(event) => updateField("active", event.target.checked)} type="checkbox" className="h-4 w-4 accent-yellow-400" />
            <span>{copy.active}</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button disabled={saving} className="button-primary px-5">{form.id ? copy.update : copy.create}</button>
          {form.id ? (
            <button disabled={saving} type="button" className="button-accent-outline px-5" onClick={handleDelete}>
              {copy.delete}
            </button>
          ) : null}
          <button
            type="button"
            className="button-secondary px-5"
            onClick={() => {
              setSelectedId("");
              setForm(createBlankState());
              setStatus("");
            }}
          >
            {copy.reset}
          </button>
        </div>

        {status ? <p className="text-sm text-zinc-400">{status}</p> : null}
      </form>
    </div>
  );
}
