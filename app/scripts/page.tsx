import { ScriptGenerator } from "@/components/script-generator";
import { SiteShell } from "@/components/site-shell";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { normalizeLanguage } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { translateScenarioText } from "@/lib/translation";

export default async function ScriptsPage() {
  const user = await requireUser();
  const language = normalizeLanguage(user.language);
  const dict = getDictionary(language);
  const [scenarios, savedScripts] = await Promise.all([
    prisma.promptScenario.findMany({ where: { active: true }, orderBy: { title: "asc" } }),
    prisma.scriptRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 12
    })
  ]);
  const translatedScenarios = await translateScenarioText(scenarios, language);
  const translatedScenarioById = new Map(translatedScenarios.map((scenario) => [scenario.id, scenario]));

  return (
    <SiteShell language={language} role={user.role}>
      <section>
        <p className="text-xs uppercase tracking-[0.35em] text-gold sm:text-sm">{dict.scriptStudio}</p>
        <h1 className="mt-3 font-display text-4xl text-white sm:mt-4 sm:text-5xl">{dict.scriptStudioTitle}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 sm:mt-5 sm:text-lg sm:leading-8">{dict.scriptStudioIntro}</p>
      </section>
      <section className="mt-8 sm:mt-10">
        <ScriptGenerator
          scenarios={translatedScenarios.map((scenario) => ({ id: scenario.id, title: scenario.title, slug: scenario.slug }))}
          savedScripts={savedScripts.map((item) => ({
            id: item.id,
            title: item.title ?? (translatedScenarioById.get(item.scenarioId)?.title ?? dict.scenario),
            scenarioId: item.scenarioId,
            scenarioSlug: translatedScenarioById.get(item.scenarioId)?.slug ?? "",
            scenarioTitle: translatedScenarioById.get(item.scenarioId)?.title ?? dict.scenario,
            language: item.language,
            tone: item.tone,
            audience: item.audience,
            length: item.length,
            output: item.output,
            createdAt: item.createdAt.toISOString()
          }))}
          defaultLanguage={language}
          text={{
            aiScriptStudio: dict.aiScriptStudio,
            scenario: dict.scenario,
            language: dict.language,
            tone: dict.tone,
            audience: dict.audience,
            length: dict.length,
            short: dict.short,
            medium: dict.medium,
            long: dict.long,
            formal: dict.formal,
            energetic: dict.energetic,
            friendly: dict.friendly,
            corporate: dict.corporate,
            wedding: dict.wedding,
            youth: dict.youth,
            community: dict.community,
            generating: dict.generating,
            generateScript: dict.generateScript,
            output: dict.output,
            scriptPlaceholder: dict.scriptPlaceholder,
            eventContext: dict.eventContext,
            eventContextPlaceholder: dict.eventContextPlaceholder,
            savedScripts: dict.savedScripts,
            savedScriptsIntro: dict.savedScriptsIntro,
            noSavedScripts: dict.noSavedScripts,
            delete: dict.delete,
            createdLabel: dict.createdLabel,
            saveScript: dict.saveScript,
            clearOutput: dict.clearOutput,
            scriptName: dict.scriptName,
            scriptNamePlaceholder: dict.scriptNamePlaceholder,
            cancel: dict.cancel,
            scenarioLabelShort: dict.scenarioLabelShort
          }}
        />
      </section>
    </SiteShell>
  );
}
