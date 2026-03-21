import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { normalizeLanguage } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { translateScenarioText } from "@/lib/translation";

export default async function FeedbackPage({ searchParams }: { searchParams: Promise<{ session?: string }> }) {
  const user = await requireUser();
  const language = normalizeLanguage(user.language);
  const dict = getDictionary(language);
  const { session } = await searchParams;
  if (!session) notFound();

  const feedback = await prisma.feedback.findUnique({
    where: { practiceSessionId: session },
    include: { practiceSession: { include: { scenario: true } } }
  });

  if (!feedback) notFound();

  const [translatedScenario] = await translateScenarioText([feedback.practiceSession.scenario], language);
  const tips = JSON.parse(feedback.improvementTips) as string[];
  const transcript = feedback.practiceSession.transcript.trim();
  const wordCount = transcript ? transcript.split(/\s+/).filter(Boolean).length : 0;
  const estimatedWpm = feedback.practiceSession.durationSeconds > 0 && wordCount > 0
    ? Math.round((wordCount / feedback.practiceSession.durationSeconds) * 60)
    : 0;

  return (
    <SiteShell language={language} role={user.role}>
      <section>
        <p className="text-sm uppercase tracking-[0.35em] text-gold">{dict.aiFeedback}</p>
        <h1 className="mt-4 font-display text-5xl text-white">{translatedScenario.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">{feedback.summary}</p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-5">
        {[
          [dict.confidence, feedback.confidence],
          [dict.clarity, feedback.clarity],
          [dict.pace, feedback.pace],
          [dict.energy, feedback.energy],
          [dict.fillerWords, feedback.fillerWords]
        ].map(([label, value]) => (
          <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">{label}</p>
            <p className="mt-3 font-display text-4xl text-white">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-[#111111] p-6">
          <h2 className="font-display text-3xl text-white">{dict.improvementTips}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {tips.map((tip) => (
              <div key={tip} className="rounded-[1.5rem] border border-gold/15 bg-gold/10 p-5 text-sm leading-7 text-zinc-200">
                {tip}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-3xl text-white">{dict.sessionSignals}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{dict.duration}</p>
              <p className="mt-2 text-2xl text-white">{feedback.practiceSession.durationSeconds}s</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{dict.recognizedWords}</p>
              <p className="mt-2 text-2xl text-white">{wordCount}</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{dict.estimatedWpm}</p>
              <p className="mt-2 text-2xl text-white">{estimatedWpm || "N/A"}</p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{dict.capturedTranscript}</p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              {transcript || dict.transcriptUnavailable}
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
