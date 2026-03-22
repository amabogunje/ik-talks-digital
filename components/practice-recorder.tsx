"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  scenarioSlug: string;
  scenarioTitle: string;
  text: {
    recordYourDelivery: string;
    readyToRecord: string;
    recording: string;
    recordingReady: string;
    transcriptIssue: string;
    recordingPermissionDenied: string;
    recordingWithSignals: string;
    start: string;
    stop: string;
    submitting: string;
    getRealCoaching: string;
    duration: string;
    liveCoachingSignals: string;
    liveCoachingIntro: string;
    transcriptSource: string;
    liveBrowserSpeech: string;
    audioOnlyFallback: string;
    detectedPace: string;
    availableAfterRecording: string;
    averageVocalEnergy: string;
    longestPause: string;
    capturedTranscript: string;
    transcriptPrompt: string;
    speechRecognitionUnsupported: string;
  };
};

type PracticeAnalysis = {
  averageVolume: number;
  peakVolume: number;
  speechCoverage: number;
  longestPauseSeconds: number;
  wordsPerMinute: number;
  transcriptSource: "speech-recognition" | "unsupported" | "none";
};

type SpeechRecognitionResultLike = {
  0: { transcript: string };
  isFinal: boolean;
  length: number;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: SpeechRecognitionResultLike[];
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

type AudioStats = {
  samples: number;
  totalLevel: number;
  peakLevel: number;
  speakingSamples: number;
  currentPauseSamples: number;
  longestPauseSamples: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const extendedWindow = window as Window & {
    webkitSpeechRecognition?: SpeechRecognitionCtor;
    SpeechRecognition?: SpeechRecognitionCtor;
  };
  return extendedWindow.SpeechRecognition ?? extendedWindow.webkitSpeechRecognition;
}

function getRecognitionLanguage() {
  if (typeof document === "undefined") return "en-NG";
  const languageText = document.documentElement.lang || "en";
  if (languageText.startsWith("fr")) return "fr-FR";
  return "en-NG";
}

export function PracticeRecorder({ scenarioSlug, scenarioTitle, text }: Props) {
  const [recording, setRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState(text.readyToRecord);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [analysis, setAnalysis] = useState<PracticeAnalysis | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [supportsSpeech, setSupportsSpeech] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analysisTimerRef = useRef<number | null>(null);
  const audioStatsRef = useRef<AudioStats>({ samples: 0, totalLevel: 0, peakLevel: 0, speakingSamples: 0, currentPauseSamples: 0, longestPauseSamples: 0 });
  const finalTranscriptRef = useRef("");
  const finalDurationRef = useRef(0);

  useEffect(() => {
    setSupportsSpeech(Boolean(getSpeechRecognitionCtor()));
    setStatus(text.readyToRecord);
    return () => {
      cleanupMedia();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl, text.readyToRecord]);

  function cleanupMedia() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (analysisTimerRef.current) window.clearInterval(analysisTimerRef.current);
    speechRecognitionRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioContextRef.current?.close().catch(() => undefined);
    timerRef.current = null;
    analysisTimerRef.current = null;
    streamRef.current = null;
    audioContextRef.current = null;
  }

  function startSpeechRecognition() {
    const RecognitionCtor = getSpeechRecognitionCtor();
    if (!RecognitionCtor) return;

    const recognition = new RecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = getRecognitionLanguage();
    recognition.onresult = (event) => {
      let nextFinal = finalTranscriptRef.current;
      let nextInterim = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const textResult = result[0]?.transcript?.trim() ?? "";
        if (!textResult) continue;
        if (result.isFinal) nextFinal = `${nextFinal} ${textResult}`.trim();
        else nextInterim = `${nextInterim} ${textResult}`.trim();
      }

      finalTranscriptRef.current = nextFinal;
      setTranscript(nextFinal);
      setInterimTranscript(nextInterim);
    };
    recognition.onerror = () => {
      setStatus(text.transcriptIssue);
    };
    recognition.onend = () => {
      if (recording) {
        try {
          recognition.start();
        } catch {
          return;
        }
      }
    };

    speechRecognitionRef.current = recognition;
    recognition.start();
  }

  function startAudioAnalysis(stream: MediaStream) {
    const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;

    const context = new AudioContextCtor();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);

    const data = new Uint8Array(analyser.fftSize);
    audioContextRef.current = context;
    audioStatsRef.current = { samples: 0, totalLevel: 0, peakLevel: 0, speakingSamples: 0, currentPauseSamples: 0, longestPauseSamples: 0 };

    analysisTimerRef.current = window.setInterval(() => {
      analyser.getByteTimeDomainData(data);
      let sumSquares = 0;
      for (let index = 0; index < data.length; index += 1) {
        const normalized = (data[index] - 128) / 128;
        sumSquares += normalized * normalized;
      }
      const rms = Math.sqrt(sumSquares / data.length);
      const level = clamp(Math.round(rms * 220), 0, 100);
      const threshold = 12;
      const stats = audioStatsRef.current;
      stats.samples += 1;
      stats.totalLevel += level;
      stats.peakLevel = Math.max(stats.peakLevel, level);

      if (level >= threshold) {
        stats.speakingSamples += 1;
        stats.longestPauseSamples = Math.max(stats.longestPauseSamples, stats.currentPauseSamples);
        stats.currentPauseSamples = 0;
      } else {
        stats.currentPauseSamples += 1;
      }
    }, 200);
  }

  function finalizeAnalysis(seconds: number) {
    const stats = audioStatsRef.current;
    const wordCount = finalTranscriptRef.current.trim() ? finalTranscriptRef.current.trim().split(/\s+/).filter(Boolean).length : 0;
    const wordsPerMinute = seconds > 0 && wordCount > 0 ? Math.round((wordCount / seconds) * 60) : 0;
    const averageVolume = stats.samples > 0 ? Math.round(stats.totalLevel / stats.samples) : 0;
    const speechCoverage = stats.samples > 0 ? Number((stats.speakingSamples / stats.samples).toFixed(2)) : 0;
    const longestPauseSamples = Math.max(stats.longestPauseSamples, stats.currentPauseSamples);

    const nextAnalysis: PracticeAnalysis = {
      averageVolume,
      peakVolume: stats.peakLevel,
      speechCoverage,
      longestPauseSeconds: Number((longestPauseSamples * 0.2).toFixed(1)),
      wordsPerMinute,
      transcriptSource: supportsSpeech ? (wordCount > 0 ? "speech-recognition" : "none") : "unsupported"
    };

    setAnalysis(nextAnalysis);
    return nextAnalysis;
  }

  async function startRecording() {
    try {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }
      setTranscript("");
      setInterimTranscript("");
      finalTranscriptRef.current = "";
      setAnalysis(null);

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => undefined);
      }

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        if (videoRef.current) videoRef.current.srcObject = null;
        setPreviewUrl(url);
        setStatus(text.recordingReady);
      };

      startAudioAnalysis(stream);
      startSpeechRecognition();
      recorder.start();
      setRecording(true);
      setDuration(0);
      finalDurationRef.current = 0;
      setStatus(text.recordingWithSignals);
      timerRef.current = window.setInterval(() => {
        setDuration((value) => {
          const next = value + 1;
          finalDurationRef.current = next;
          return next;
        });
      }, 1000);
    } catch {
      setStatus(text.recordingPermissionDenied);
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    speechRecognitionRef.current?.stop();
    cleanupMedia();
    setRecording(false);
    finalizeAnalysis(finalDurationRef.current || duration);
  }

  async function submitSession() {
    setSubmitting(true);
    const response = await fetch("/api/practice/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenarioSlug, transcript: finalTranscriptRef.current, durationSeconds: finalDurationRef.current || duration, recordingLabel: `${scenarioTitle} practice`, analysis })
    });

    const data = await response.json();
    window.location.href = `/practice/${scenarioSlug}/feedback?session=${data.sessionId}`;
  }

  const canSubmit = !recording && (duration > 0 || Boolean(analysis));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="surface-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-display text-3xl text-white">{text.recordYourDelivery}</h3>
          <span className="rounded-full border border-white/10 bg-[rgba(42,42,42,0.72)] px-3 py-1 text-sm text-zinc-300">{status}</span>
        </div>
        <div className="mt-6 overflow-hidden rounded-[1rem] border border-white/10 bg-[rgba(24,24,24,0.9)] aspect-video">
          {previewUrl ? (
            <video ref={videoRef} src={previewUrl} controls className="h-full w-full object-cover" />
          ) : (
            <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
          )}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={startRecording} disabled={recording || submitting} className="button-primary px-5 disabled:opacity-50">
            {text.start}
          </button>
          <button onClick={stopRecording} disabled={!recording} className="button-secondary px-5 disabled:opacity-50">
            {text.stop}
          </button>
          <button onClick={submitSession} disabled={!canSubmit || submitting} className="button-accent-outline px-5 disabled:opacity-50">
            {submitting ? text.submitting : text.getRealCoaching}
          </button>
          <span className="self-center text-sm text-zinc-400">{text.duration}: {duration}s</span>
        </div>
      </div>

      <div className="surface-card p-6">
        <h3 className="font-display text-2xl text-white">{text.liveCoachingSignals}</h3>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{text.liveCoachingIntro}</p>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="surface-card-muted p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{text.transcriptSource}</p>
            <p className="mt-2 text-sm text-white">{supportsSpeech ? text.liveBrowserSpeech : text.audioOnlyFallback}</p>
          </div>
          <div className="surface-card-muted p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{text.detectedPace}</p>
            <p className="mt-2 text-sm text-white">{analysis?.wordsPerMinute ? `${analysis.wordsPerMinute} WPM` : text.availableAfterRecording}</p>
          </div>
          <div className="surface-card-muted p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{text.averageVocalEnergy}</p>
            <p className="mt-2 text-sm text-white">{analysis ? `${analysis.averageVolume}/100` : text.availableAfterRecording}</p>
          </div>
          <div className="surface-card-muted p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{text.longestPause}</p>
            <p className="mt-2 text-sm text-white">{analysis ? `${analysis.longestPauseSeconds}s` : text.availableAfterRecording}</p>
          </div>
        </div>

        <div className="surface-card-soft mt-5 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{text.capturedTranscript}</p>
          <p className="mt-3 min-h-24 text-sm leading-7 text-zinc-200">
            {transcript || interimTranscript || text.transcriptPrompt}
          </p>
        </div>

        {!supportsSpeech ? (
          <p className="mt-4 text-sm leading-6 text-amber-200">{text.speechRecognitionUnsupported}</p>
        ) : null}
      </div>
    </div>
  );
}
