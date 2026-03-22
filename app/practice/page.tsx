import { ScenarioCard } from "@/components/scenario-card";
import { SiteShell } from "@/components/site-shell";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { normalizeLanguage } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { translateScenarioText } from "@/lib/translation";

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

function getChartBounds(series: number[][]) {
  const values = series.flat().filter((value) => Number.isFinite(value));
  if (!values.length) {
    return { min: 0, max: 100, marks: [25, 50, 75] };
  }

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const spread = Math.max(rawMax - rawMin, 8);
  const padding = Math.max(4, Math.round(spread * 0.35));
  const min = Math.max(0, rawMin - padding);
  const max = Math.min(100, rawMax + padding);
  const innerSpread = Math.max(max - min, 1);
  const marks = [0.25, 0.5, 0.75].map((ratio) => Math.round(min + innerSpread * ratio));

  return { min, max, marks };
}

function getPoint(value: number, index: number, count: number, width: number, height: number, paddingX: number, paddingY: number, min: number, max: number) {
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;
  const x = count === 1 ? width / 2 : paddingX + (innerWidth * index) / (count - 1);
  const ratio = max === min ? 0.5 : (value - min) / (max - min);
  const y = paddingY + innerHeight - ratio * innerHeight;
  return { x, y };
}

function buildPath(values: number[], width: number, height: number, paddingX: number, paddingY: number, min: number, max: number) {
  if (!values.length) return "";

  return values
    .map((value, index) => {
      const point = getPoint(value, index, values.length, width, height, paddingX, paddingY, min, max);
      return `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
    })
    .join(" ");
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
      take: 12,
      include: { practiceSession: { include: { scenario: true } } }
    })
  ]);

  const translatedScenarios = await translateScenarioText(scenarios, language);
  const latestFeedback = feedbackEntries[0] ?? null;
  const previousFeedback = feedbackEntries[1] ?? null;
  const chartEntries = [...feedbackEntries].reverse();

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

  const chartWidth = 680;
  const chartHeight = 180;
  const paddingX = 16;
  const paddingY = 18;
  const confidenceValues = chartEntries.map((entry) => entry.confidence);
  const clarityValues = chartEntries.map((entry) => entry.clarity);
  const paceValues = chartEntries.map((entry) => entry.pace);
  const bounds = getChartBounds([confidenceValues, clarityValues, paceValues]);
  const confidencePath = buildPath(confidenceValues, chartWidth, chartHeight, paddingX, paddingY, bounds.min, bounds.max);
  const clarityPath = buildPath(clarityValues, chartWidth, chartHeight, paddingX, paddingY, bounds.min, bounds.max);
  const pacePath = buildPath(paceValues, chartWidth, chartHeight, paddingX, paddingY, bounds.min, bounds.max);

  return (
    <SiteShell language={language} role={user.role}>
      <section>
        <p className="text-xs uppercase tracking-[0.35em] text-gold sm:text-sm">{dict.practiceLibrary}</p>
        <h1 className="mt-3 font-display text-4xl text-white sm:mt-4 sm:text-5xl">{dict.practiceLibraryTitle}</h1>
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
      <section className="mt-8 surface-card px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="xl:max-w-[16rem]">
            <p className="font-display text-2xl text-white sm:text-[2rem]">{dict.improvementOverTime}</p>
          </div>

          <div className="min-w-0 flex-1 xl:max-w-4xl">
            {trendCards.length ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-[0.9rem] border border-white/10 bg-black/20 px-3 py-3">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#f5c84c]/20 bg-[#f5c84c]/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-[#f5c84c]">
                      <span className="h-2 w-2 rounded-full bg-[#f5c84c]" />
                      {dict.confidence}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#7dd3fc]/20 bg-[#7dd3fc]/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-[#7dd3fc]">
                      <span className="h-2 w-2 rounded-full bg-[#7dd3fc]" />
                      {dict.clarity}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#f97316]/20 bg-[#f97316]/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-[#fdba74]">
                      <span className="h-2 w-2 rounded-full bg-[#f97316]" />
                      {dict.pace}
                    </span>
                  </div>

                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-40 w-full" preserveAspectRatio="none" aria-label={dict.improvementOverTime}>
                    {bounds.marks.map((mark) => {
                      const point = getPoint(mark, 0, 1, chartWidth, chartHeight, paddingX, paddingY, bounds.min, bounds.max);
                      return (
                        <g key={mark}>
                          <line x1={paddingX} y1={point.y} x2={chartWidth - paddingX} y2={point.y} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 5" />
                          <text x={chartWidth - paddingX - 2} y={point.y - 6} textAnchor="end" fill="rgba(255,255,255,0.45)" fontSize="10">{mark}</text>
                        </g>
                      );
                    })}
                    {chartEntries.map((_, index) => {
                      const x = chartEntries.length === 1 ? chartWidth / 2 : paddingX + ((chartWidth - paddingX * 2) * index) / (chartEntries.length - 1);
                      return <line key={index} x1={x} y1={paddingY} x2={x} y2={chartHeight - paddingY} stroke="rgba(255,255,255,0.05)" />;
                    })}
                    {confidencePath ? <path d={confidencePath} fill="none" stroke="#f5c84c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> : null}
                    {clarityPath ? <path d={clarityPath} fill="none" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> : null}
                    {pacePath ? <path d={pacePath} fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> : null}
                    {confidenceValues.map((value, index) => {
                      const point = getPoint(value, index, confidenceValues.length, chartWidth, chartHeight, paddingX, paddingY, bounds.min, bounds.max);
                      return <circle key={`confidence-${index}`} cx={point.x} cy={point.y} r="3.5" fill="#f5c84c" />;
                    })}
                    {clarityValues.map((value, index) => {
                      const point = getPoint(value, index, clarityValues.length, chartWidth, chartHeight, paddingX, paddingY, bounds.min, bounds.max);
                      return <circle key={`clarity-${index}`} cx={point.x} cy={point.y} r="3.5" fill="#7dd3fc" />;
                    })}
                    {paceValues.map((value, index) => {
                      const point = getPoint(value, index, paceValues.length, chartWidth, chartHeight, paddingX, paddingY, bounds.min, bounds.max);
                      return <circle key={`pace-${index}`} cx={point.x} cy={point.y} r="3.5" fill="#f97316" />;
                    })}
                  </svg>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  {trendCards.map((trend) => (
                    <div key={trend.label} className={`rounded-[0.8rem] border px-3 py-2.5 ${trendStyles[trend.status]}`}>
                      <p className="text-[11px] uppercase tracking-[0.18em] opacity-80">{trend.label}</p>
                      <div className="mt-1 flex items-end justify-between gap-2">
                        <p className="font-display text-2xl leading-none sm:text-[1.9rem]">{trend.value}%</p>
                        <p className="text-[11px] uppercase tracking-[0.12em] opacity-85">{trendLabels[trend.status]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[0.8rem] border border-white/10 bg-white/5 px-3 py-3 text-sm text-zinc-300 xl:max-w-xl">
                {dict.noPracticeHistoryHint}
              </div>
            )}
          </div>
        </div>
      </section>

    </SiteShell>
  );
}
