import Link from "next/link";
import { ScenarioCard } from "@/components/scenario-card";
import { SiteShell } from "@/components/site-shell";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { normalizeLanguage } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { translateScenarioText } from "@/lib/translation";

function averageScore(feedback: { confidence: number; clarity: number; pace: number; energy: number }) {
  return Math.round((feedback.confidence + feedback.clarity + feedback.pace + feedback.energy) / 4);
}

function getTrendStatus(current: number, previous?: number | null) {
  if (previous !== undefined && previous !== null) {
    const delta = current - previous;
    if (delta >= 4) return "improving" as const;
    if (delta <= -4 || current < 70) return "needsWork" as const;
  }

  if (current >= 80) return "strong" as const;
  if (current < 70) return "needsWork" as const;
  return "steady" as const;
}

export default async function PracticeLibraryPage() {
  const user = await requireUser();
  const language = normalizeLanguage(user.language);
  const dict = getDictionary(language);
  const [scenarios, feedbackEntries] = await Promise.all([
    prisma.promptScenario.findMany({
      where: { active: true },
      orderBy: { title: "asc" }
    }),
    prisma.feedback.findMany({
      where: { practiceSession: { userId: user.id } },
      orderBy: { createdAt: "desc" },
      take: 24,
      include: { practiceSession: { include: { scenario: true } } }
    })
  ]);

  const translatedScenarios = await translateScenarioText(scenarios, language);
  const translatedFeedbackScenarios = await translateScenarioText(
    feedbackEntries.map((entry) => entry.practiceSession.scenario),
    language
  );
  const scenarioMap = new Map(translatedFeedbackScenarios.map((scenario) => [scenario.id, scenario]));

  const latestFeedback = feedbackEntries[0] ?? null;
  const previousFeedback = feedbackEntries[1] ?? null;
  const trendCards = latestFeedback
    ? [
        {
          label: dict.confidence,
          value: latestFeedback.confidence,
          status: getTrendStatus(latestFeedback.confidence, previousFeedback?.confidence)
        },
        {
          label: dict.clarity,
          value: latestFeedback.clarity,
          status: getTrendStatus(latestFeedback.clarity, previousFeedback?.clarity)
        },
        {
          label: dict.pace,
          value: latestFeedback.pace,
          status: getTrendStatus(latestFeedback.pace, previousFeedback?.pace)
        }
      ]
    : [];

  const trendLabels = {
    improving: dict.improvingLabel,
    steady: dict.steadyLabel,
    needsWork: dict.needsWorkLabel,
    strong: dict.strongLabel
  };

  const trendStyles = {
    improving: "border-gold/20 bg-gold/10 text-gold",
    steady: "border-white/10 bg-white/5 text-zinc-200",
    needsWork: "border-amber-500/20 bg-amber-500/10 text-amber-200",
    strong: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
  };

  const dateFormatter = new Intl.DateTimeFormat(language === "FR" ? "fr-FR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const historyByScenario = Array.from(
    feedbackEntries.reduce((map, entry) => {
      const key = entry.practiceSession.scenarioId;
      const score = averageScore(entry);
      const current = map.get(key);
      if (current) {
        current.entries.push(entry);
        current.totalScore += score;
        current.latestScore = Math.max(current.latestScore, score);
        if (entry.createdAt > current.latestEntry.createdAt) {
          current.latestEntry = entry;
        }
        return map;
      }

      map.set(key, {
        scenarioId: key,
        latestEntry: entry,
        entries: [entry],
        totalScore: score,
        latestScore: score
      });
      return map;
    }, new Map())
  )
    .map(([, group]) => ({
      ...group,
      averageScore: Math.round(group.totalScore / group.entries.length)
    }))
    .sort((a, b) => b.latestEntry.createdAt.getTime() - a.latestEntry.createdAt.getTime())
    .slice(0, 6);

  return (
    <SiteShell language={language} role={user.role}>
      <section>
        <p className="text-xs uppercase tracking-[0.35em] text-gold sm:text-sm">{dict.practiceLibrary}</p>
        <h1 className="mt-3 font-display text-4xl text-white sm:mt-4 sm:text-5xl">{dict.practiceLibraryTitle}</h1>
      </section>

      <section className="mt-8 surface-card px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="lg:max-w-sm">
            <p className="font-display text-2xl text-white sm:text-[2rem]">{dict.improvementOverTime}</p>
          </div>

          {trendCards.length ? (
            <div className="grid gap-2 sm:grid-cols-3 lg:flex lg:items-stretch lg:justify-end">
              {trendCards.map((trend) => (
                <div key={trend.label} className={`rounded-[0.8rem] border px-3 py-2.5 lg:min-w-[132px] ${trendStyles[trend.status]}`}>
                  <p className="text-[11px] uppercase tracking-[0.18em] opacity-80">{trend.label}</p>
                  <div className="mt-1 flex items-end justify-between gap-2">
                    <p className="font-display text-2xl leading-none sm:text-[1.9rem]">{trend.value}%</p>
                    <p className="text-[11px] uppercase tracking-[0.12em] opacity-85">{trendLabels[trend.status]}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[0.8rem] border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-300 lg:max-w-md">
              {dict.noPracticeHistoryHint}
            </div>
          )}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-4">
          <h2 className="section-title">{dict.guidedPracticeCollection}</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gold/35 via-white/10 to-transparent" />
        </div>
        <div className="mt-6 grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
          {translatedScenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} slug={scenario.slug} title={scenario.title} description={scenario.description} guidance={scenario.guidance ?? ""} />
          ))}
        </div>
      </section>

      <section className="mt-10 surface-card p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <h2 className="section-title">{dict.practiceHistoryTitle}</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gold/35 via-white/10 to-transparent" />
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-300">{dict.practiceHistoryIntro}</p>

        {historyByScenario.length ? (
          <div className="mt-5 space-y-3">
            {historyByScenario.map((group) => {
              const translatedScenario = scenarioMap.get(group.scenarioId);

              return (
                <Link
                  key={group.scenarioId}
                  href={`/practice/${group.latestEntry.practiceSession.scenario.slug}/feedback?session=${group.latestEntry.practiceSessionId}`}
                  className="block rounded-[1rem] border border-white/10 bg-white/5 p-4 transition duration-200 hover:border-gold/30 hover:bg-white/[0.07]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{dateFormatter.format(group.latestEntry.createdAt)}</p>
                      <h3 className="mt-2 text-lg text-white">{translatedScenario?.title ?? group.latestEntry.practiceSession.scenario.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-300">{group.latestEntry.summary}</p>
                    </div>
                    <div className="grid gap-2 lg:min-w-[9rem]">
                      <div className="rounded-[0.8rem] border border-gold/20 bg-gold/10 px-3 py-2.5">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-gold/80">{dict.averageScoreLabel}</p>
                        <p className="mt-1 font-display text-2xl text-white">{group.averageScore}%</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 rounded-[1rem] border border-gold/15 bg-gold/10 p-5 text-sm leading-6 text-zinc-200">
            <p className="font-display text-2xl text-white">{dict.noPracticeHistoryTitle}</p>
            <p className="mt-2">{dict.noPracticeHistoryBody}</p>
            <p className="mt-3 text-zinc-300">{dict.noPracticeHistoryHint}</p>
          </div>
        )}
      </section>
    </SiteShell>
  );
}