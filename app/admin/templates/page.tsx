import { AdminForm } from "@/components/admin-form";
import { requireAdmin } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { getAdminContext } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminTemplatesPage() {
  const user = await requireAdmin();
  const dict = getDictionary(user.language);
  const { copy } = await getAdminContext(user.language);

  const templates = await prisma.scriptTemplate.findMany({ include: { scenario: true }, orderBy: { scenarioId: "asc" } });

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="section-title">{copy.templatesNav}</h2>
        <p className="max-w-3xl text-sm leading-7 text-zinc-400">{copy.templatesIntro}</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)] xl:items-start">
        <AdminForm
          action="/api/admin/templates"
          title={dict.addScriptTemplate}
          fields={[
            { name: "scenarioSlug", label: dict.scenarioSlug },
            { name: "language", label: dict.language },
            { name: "tone", label: dict.tone },
            { name: "audience", label: dict.audience },
            { name: "template", label: dict.template, type: "textarea" }
          ]}
          text={{ save: dict.save, savedSuccessfully: dict.savedSuccessfully, unableToSave: dict.unableToSave }}
        />

        <div className="surface-card p-5 sm:p-6">
          <h3 className="font-display text-2xl text-white">{dict.templates}</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {templates.map((template) => (
              <div key={template.id} className="rounded-[1rem] border border-white/10 bg-black/20 p-4">
                <p className="text-lg text-white">{template.scenario.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{template.language} - {template.tone} - {template.audience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
