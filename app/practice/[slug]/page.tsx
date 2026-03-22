import Link from "next/link";
import { notFound } from "next/navigation";
import { PracticeRecorder } from "@/components/practice-recorder";
import { SiteShell } from "@/components/site-shell";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { normalizeLanguage } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { translateScenarioText } from "@/lib/translation";

function averageScore(feedback: { confidence: number; clarity: number; pace: number; energy: number }) {
  return Math.round((feedback.confidence + feedback.clarity + feedback.pace + feedback.energy) / 4);
}

export default async function PracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await requireUser();
  const language = normalizeLanguage(user.language);
  const dict = getDictionary(language);
  const { slug } = await params;

  const scenario = await prisma.promptScenario.findUnique({ where: { slug } });
  if (!scenario) notFound();

  const [translatedScenario] = await translateScenarioText([scenario], language);
  const feedbackHistory = await prisma.feedback.findMany({
    where: {
      practiceSession: {
        userId: user.id,
        scenarioId: scenario.id
      }
    },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { practiceSession: true }
  });

  const latestFeedback = feedbackHistory[0] ?? null;
  const averageScenarioScore = feedbackHistory.length
    ? Math.round(feedbackHistory.reduce((sum, entry) => sum + averageScore(entry), 0) / feedbackHistory.length)
    : null;

  const dateFormatter = new Intl.DateTimeFormat(language === "FR" ? "fr-FR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <SiteShell language={language} role={user.role}>
      <section>
        <p className="text-sm uppercase tracking-[0.35em] text-gold">{dict.practiceScenario}</p>
        <h1 className="mt-4 font-display text-5xl text-white">{translatedScenario.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">{translatedScenario.description}</p>
        <p className="mt-5 max-w-3xl rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-zinc-300">
          {translatedScenario.guidance}
        </p>
      </section>

      <section className="mt-10">
        <PracticeRecorder scenarioSlug={translatedScenario.slug} scenarioTitle={translatedScenario.title} text={{ recordYourDelivery: dict.recordYourDelivery, readyToRecord: dict.readyToRecord, recording: dict.recording, recordingReady: dict.recordingReady, transcriptIssue: dict.transcriptIssue, recordingPermissionDenied: dict.recordingPermissionDenied, recordingWithSignals: dict.recordingWithSignals, start: dict.start, stop: dict.stop, submitting: dict.submitting, getRealCoaching: dict.getRealCoaching, duration: dict.duration, liveCoachingSignals: dict.liveCoachingSignals, liveCoachingIntro: dict.liveCoachingIntro, transcriptSource: dict.transcriptSource, liveBrowserSpeech: dict.liveBrowserSpeech, audioOnlyFallback: dict.audioOnlyFallback, detectedPace: dict.detectedPace, availableAfterRecording: dict.availableAfterRecording, averageVocalEnergy: dict.averageVocalEnergy, longestPause: dict.longestPause, capturedTranscript: dict.capturedTranscript, transcriptPrompt: dict.transcriptPrompt, speechRecognitionUnsupported: dict.speechRecognitionUnsupported }} />
      </section>

      <section className="mt-10 surface-card p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <h2 className="section-title">{dict.practiceHistoryTitle}</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gold/35 via-white/10 to-transparent" />
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-300">{dict.practiceHistoryIntro}</p>

        {feedbackHistory.length ? (
          <>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:max-w-3xl">
              <div className="surface-card-muted p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{dict.attemptsLabel}</p>
                <p className="mt-1 font-display text-3xl text-white">{feedbackHistory.length}</p>
              </div>
              <div className="surface-card-muted p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{dict.latestScoreLabel}</p>
                <p className="mt-1 font-display text-3xl text-white">{latestFeedback ? `${averageScore(latestFeedback)}%` : "-"}</p>
              </div>
              <div className="rounded-[0.9rem] border border-gold/20 bg-gold/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gold/80">{dict.averageScoreLabel}</p>
                <p className="mt-1 font-display text-3xl text-white">{averageScenarioScore !== null ? `${averageScenarioScore}%` : "-"}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {feedbackHistory.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/practice/${translatedScenario.slug}/feedback?session=${entry.practiceSessionId}`}
                  className="block rounded-[1rem] border border-white/10 bg-white/5 p-4 transition duration-200 hover:border-gold/30 hover:bg-white/[0.07]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{dateFormatter.format(entry.createdAt)}</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-300">{entry.summary}</p>
                    </div>
                    <div className="shrink-0 rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-gold">
                      {averageScore(entry)}%
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
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
