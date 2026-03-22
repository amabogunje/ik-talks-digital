import { AdminForm } from "@/components/admin-form";
import { requireAdmin } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { getAdminContext } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { translateScenarioText } from "@/lib/translation";

export default async function AdminScenariosPage() {
  const user = await requireAdmin();
  const dict = getDictionary(user.language);
  const { language, copy } = await getAdminContext(user.language);

  const scenarios = await prisma.promptScenario.findMany({ orderBy: { createdAt: "desc" } });
  const translatedScenarios = await translateScenarioText(scenarios, language);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="section-title">{copy.scenariosNav}</h2>
        <p className="max-w-3xl text-sm leading-7 text-zinc-400">{copy.scenariosIntro}</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)] xl:items-start">
        <AdminForm
          action="/api/admin/scenarios"
          title={dict.createScenario}
          fields={[
            { name: "title", label: dict.title },
            { name: "slug", label: dict.slug },
            { name: "description", label: dict.description, type: "textarea" },
            { name: "guidance", label: dict.guidance, type: "textarea" }
          ]}
          text={{ save: dict.save, savedSuccessfully: dict.savedSuccessfully, unableToSave: dict.unableToSave }}
        />

        <div className="surface-card p-5 sm:p-6">
          <h3 className="font-display text-2xl text-white">{dict.scenarios}</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {translatedScenarios.map((scenario) => (
              <div key={scenario.id} className="rounded-[1rem] border border-white/10 bg-black/20 p-4">
                <p className="text-lg text-white">{scenario.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{scenario.slug}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
