import { ScenarioCard } from "@/components/scenario-card";
import { SiteShell } from "@/components/site-shell";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { normalizeLanguage } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { translateScenarioText } from "@/lib/translation";

export default async function PracticeLibraryPage() {
  const user = await requireUser();
  const language = normalizeLanguage(user.language);
  const dict = getDictionary(language);
  const scenarios = await prisma.promptScenario.findMany({
    where: { active: true },
    orderBy: { title: "asc" }
  });
  const translatedScenarios = await translateScenarioText(scenarios, language);

  return (
    <SiteShell language={language} role={user.role}>
      <section>
        <p className="text-sm uppercase tracking-[0.35em] text-gold">{dict.practiceLibrary}</p>
        <h1 className="mt-4 font-display text-5xl text-white">{dict.practiceLibraryTitle}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">{dict.practiceLibraryIntro}</p>
      </section>
      <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {translatedScenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} slug={scenario.slug} title={scenario.title} description={scenario.description} guidance={scenario.guidance ?? ""} />
        ))}
      </section>
    </SiteShell>
  );
}
