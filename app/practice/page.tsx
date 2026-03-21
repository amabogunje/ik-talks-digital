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
        <p className="text-xs uppercase tracking-[0.35em] text-gold sm:text-sm">{dict.practiceLibrary}</p>
        <h1 className="mt-3 font-display text-4xl text-white sm:mt-4 sm:text-5xl">{dict.practiceLibraryTitle}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 sm:mt-5 sm:text-lg sm:leading-8">{dict.practiceLibraryIntro}</p>
      </section>
      <section className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {translatedScenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} slug={scenario.slug} title={scenario.title} description={scenario.description} guidance={scenario.guidance ?? ""} />
        ))}
      </section>
    </SiteShell>
  );
}
