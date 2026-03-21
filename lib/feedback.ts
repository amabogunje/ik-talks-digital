import { Language } from "@prisma/client";
import { normalizeLanguage, SupportedLanguage } from "@/lib/locale";

export type PracticeAnalysis = {
  averageVolume: number;
  peakVolume: number;
  speechCoverage: number;
  longestPauseSeconds: number;
  wordsPerMinute: number;
  transcriptSource: "speech-recognition" | "unsupported" | "none";
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getLocalizedContent(language: Language) {
  const supportedLanguage: SupportedLanguage = normalizeLanguage(language);

  return {
    EN: {
      summary: {
        strong:
          "This felt like a real delivery, not just a rehearsal. Your presence came through with healthy vocal energy, and the structure stayed easy to follow.",
        balanced:
          "You held attention well and sounded present. The recording shows a solid speaking base, with a few delivery habits we can polish.",
        needsWork:
          "You have a clear foundation to build on. This take shows effort and intention, and the next step is making your delivery steadier and more assured."
      },
      tips: {
        paceFast: "Your pace ran a little fast. Add short pauses after key lines so the room can absorb your message.",
        paceSlow: "Your delivery was measured, but it can carry more momentum. Tighten a few pauses so your message keeps moving.",
        energyLow: "Lift your vocal energy slightly, especially in your opening and closing lines, so the room feels your presence earlier.",
        energyHigh: "Your energy is strong. Keep it, but shape it with calmer pauses so you sound intentional rather than rushed.",
        clarity: "A few filler words or recognition misses suggest you can sharpen articulation. Open your mouth more on key words and finish each sentence cleanly.",
        pauses: "There were some longer quiet gaps. Use planned pauses, but avoid disappearing between ideas.",
        finish: "Your content direction is good. End with one clean final line that sounds memorable and confident."
      }
    },
    FR: {
      summary: {
        strong:
          "Cette prise ressemble a une vraie prise de parole, pas seulement a une repetition. Votre presence vocale est bonne et la structure reste claire.",
        balanced:
          "Vous retenez bien l'attention et votre presence est perceptible. L'enregistrement montre une base solide avec quelques habitudes a affiner.",
        needsWork:
          "Vous avez une bonne base. Cette prise montre de l'intention, et la prochaine etape consiste a rendre votre delivery plus stable et plus assure."
      },
      tips: {
        paceFast: "Le rythme est un peu rapide. Ajoutez de courtes pauses apres les idees fortes pour laisser respirer le message.",
        paceSlow: "Le rythme est pose, mais il peut porter davantage d'elan. Resserrez quelques pauses pour garder l'attention.",
        energyLow: "Montez legerement l'energie vocale, surtout au debut et a la fin, pour installer votre presence plus vite.",
        energyHigh: "Votre energie est bonne. Gardez-la, mais structurez-la avec des pauses plus calmes pour paraitre plus intentionnel.",
        clarity: "Quelques mots de remplissage ou erreurs de reconnaissance suggerent que vous pouvez mieux articuler. Soignez davantage les mots cles.",
        pauses: "Il y a eu quelques silences plus longs. Utilisez des pauses volontaires, mais evitez de disparaitre entre deux idees.",
        finish: "La direction du message est bonne. Terminez avec une phrase finale nette, memorable et sure d'elle."
      }
    }
  }[supportedLanguage];
}

export function generateFeedback(transcript: string, language: Language, analysis?: Partial<PracticeAnalysis>) {
  const normalizedTranscript = transcript.trim();
  const words = normalizedTranscript.split(/\s+/).filter(Boolean);
  const fillerHits = (normalizedTranscript.match(/\b(um|uh|like|you know|abi|sha|ehn|basically|actually)\b/gi) ?? []).length;
  const durationSeconds = analysis?.wordsPerMinute && words.length ? Math.max(1, Math.round((words.length / analysis.wordsPerMinute) * 60)) : 0;
  const wordsPerMinute = analysis?.wordsPerMinute ?? (durationSeconds > 0 ? Math.round((words.length / durationSeconds) * 60) : 0);
  const speechCoverage = analysis?.speechCoverage ?? 0.5;
  const averageVolume = analysis?.averageVolume ?? 55;
  const peakVolume = analysis?.peakVolume ?? averageVolume;
  const longestPauseSeconds = analysis?.longestPauseSeconds ?? 1.2;

  const confidence = clamp(Math.round(48 + speechCoverage * 26 + averageVolume * 0.22 + Math.min(10, words.length / 8)), 55, 96);
  const clarity = clamp(Math.round(88 - fillerHits * 5 - longestPauseSeconds * 4 + (normalizedTranscript ? 4 : -8)), 50, 95);

  let paceBase = 78;
  if (wordsPerMinute > 0) {
    if (wordsPerMinute < 95) paceBase = 68;
    else if (wordsPerMinute > 165) paceBase = 70;
    else paceBase = 87;
  }
  const pace = clamp(Math.round(paceBase - Math.max(0, longestPauseSeconds - 2.5) * 4), 55, 92);
  const energy = clamp(Math.round(45 + averageVolume * 0.45 + Math.min(18, peakVolume * 0.18)), 52, 95);

  const localized = getLocalizedContent(language);
  const summaryKey = confidence >= 82 && clarity >= 78 && energy >= 74 ? "strong" : confidence >= 70 ? "balanced" : "needsWork";
  const summary = localized.summary[summaryKey];

  const tips: string[] = [];
  if (wordsPerMinute > 165) tips.push(localized.tips.paceFast);
  else if (wordsPerMinute > 0 && wordsPerMinute < 95) tips.push(localized.tips.paceSlow);

  if (energy < 68) tips.push(localized.tips.energyLow);
  else if (energy > 88) tips.push(localized.tips.energyHigh);

  if (clarity < 76) tips.push(localized.tips.clarity);
  if (longestPauseSeconds > 2.8) tips.push(localized.tips.pauses);
  tips.push(localized.tips.finish);

  return {
    confidence,
    clarity,
    pace,
    energy,
    fillerWords: fillerHits,
    summary,
    tips: tips.slice(0, 3),
    transcriptSource: analysis?.transcriptSource ?? "none",
    wordsPerMinute,
    speechCoverage,
    averageVolume,
    peakVolume,
    longestPauseSeconds
  };
}
