import { redirect } from "next/navigation";
import { AdminForm } from "@/components/admin-form";
import { SiteShell } from "@/components/site-shell";
import { requireAdmin } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { normalizeLanguage } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { translateCourseText, translateScenarioText } from "@/lib/translation";

export default async function AdminPage() {
  const user = await requireAdmin();
  if (!user) redirect("/dashboard");
  const language = normalizeLanguage(user.language);
  const dict = getDictionary(language);

  const [courses, scenarios, templates] = await Promise.all([
    prisma.course.findMany({ include: { lessons: true }, orderBy: { createdAt: "desc" } }),
    prisma.promptScenario.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.scriptTemplate.findMany({ include: { scenario: true }, orderBy: { scenarioId: "asc" } })
  ]);

  const translatedCourses = await translateCourseText(courses, language);
  const translatedScenarios = await translateScenarioText(scenarios, language);

  return (
    <SiteShell language={language} role={user.role}>
      <section>
        <p className="text-sm uppercase tracking-[0.35em] text-gold">{dict.adminPanel}</p>
        <h1 className="mt-4 font-display text-5xl text-white">{dict.adminTitle}</h1>
      </section>

      <section className="mt-10 grid gap-6 xl:grid-cols-3">
        <AdminForm action="/api/admin/courses" title={dict.createCourse} fields={[{ name: "title", label: dict.title }, { name: "slug", label: dict.slug }, { name: "description", label: dict.description }, { name: "thumbnail", label: dict.thumbnailUrl }]} text={{ save: dict.save, savedSuccessfully: dict.savedSuccessfully, unableToSave: dict.unableToSave }} />
        <AdminForm action="/api/admin/scenarios" title={dict.createScenario} fields={[{ name: "title", label: dict.title }, { name: "slug", label: dict.slug }, { name: "description", label: dict.description }, { name: "guidance", label: dict.guidance }]} text={{ save: dict.save, savedSuccessfully: dict.savedSuccessfully, unableToSave: dict.unableToSave }} />
        <AdminForm action="/api/admin/templates" title={dict.addScriptTemplate} fields={[{ name: "scenarioSlug", label: dict.scenarioSlug }, { name: "language", label: dict.language }, { name: "tone", label: dict.tone }, { name: "audience", label: dict.audience }, { name: "template", label: dict.template }]} text={{ save: dict.save, savedSuccessfully: dict.savedSuccessfully, unableToSave: dict.unableToSave }} />
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-3xl text-white">{dict.courses}</h2>
          <div className="mt-5 space-y-4">
            {translatedCourses.map((course) => (
              <div key={course.id} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                <p className="text-lg text-white">{course.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{course.lessons.length} {dict.lessonsLabel}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-3xl text-white">{dict.scenarios}</h2>
          <div className="mt-5 space-y-4">
            {translatedScenarios.map((scenario) => (
              <div key={scenario.id} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                <p className="text-lg text-white">{scenario.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{scenario.slug}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-3xl text-white">{dict.templates}</h2>
          <div className="mt-5 space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                <p className="text-lg text-white">{template.scenario.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{template.language} · {template.tone} · {template.audience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
