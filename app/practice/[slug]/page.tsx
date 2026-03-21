import { notFound } from "next/navigation";
import { PracticeRecorder } from "@/components/practice-recorder";
import { SiteShell } from "@/components/site-shell";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { normalizeLanguage } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { translateScenarioText } from "@/lib/translation";

export default async function PracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await requireUser();
  const language = normalizeLanguage(user.language);
  const dict = getDictionary(language);
  const { slug } = await params;
  const scenario = await prisma.promptScenario.findUnique({ where: { slug } });

  if (!scenario) notFound();

  const [translatedScenario] = await translateScenarioText([scenario], language);

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
      <section className="mt-10 rounded-[1.75rem] border border-gold/15 bg-gold/5 p-5 text-sm leading-7 text-zinc-200">
        {dict.practiceRecordingExplainer}
      </section>
      <section className="mt-10">
        <PracticeRecorder scenarioSlug={translatedScenario.slug} scenarioTitle={translatedScenario.title} text={{ recordYourDelivery: dict.recordYourDelivery, readyToRecord: dict.readyToRecord, recording: dict.recording, recordingReady: dict.recordingReady, transcriptIssue: dict.transcriptIssue, recordingPermissionDenied: dict.recordingPermissionDenied, recordingWithSignals: dict.recordingWithSignals, start: dict.start, stop: dict.stop, submitting: dict.submitting, getRealCoaching: dict.getRealCoaching, duration: dict.duration, liveCoachingSignals: dict.liveCoachingSignals, liveCoachingIntro: dict.liveCoachingIntro, transcriptSource: dict.transcriptSource, liveBrowserSpeech: dict.liveBrowserSpeech, audioOnlyFallback: dict.audioOnlyFallback, detectedPace: dict.detectedPace, availableAfterRecording: dict.availableAfterRecording, averageVocalEnergy: dict.averageVocalEnergy, longestPause: dict.longestPause, capturedTranscript: dict.capturedTranscript, transcriptPrompt: dict.transcriptPrompt, speechRecognitionUnsupported: dict.speechRecognitionUnsupported }} />
      </section>
    </SiteShell>
  );
}
