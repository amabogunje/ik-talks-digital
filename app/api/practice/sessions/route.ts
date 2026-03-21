import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { generateFeedback } from "@/lib/feedback";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await requireUser();
  const { scenarioSlug, transcript, durationSeconds, recordingLabel, analysis } = await request.json();

  const scenario = await prisma.promptScenario.findUnique({ where: { slug: scenarioSlug } });
  if (!scenario) return NextResponse.json({ error: "Scenario not found." }, { status: 404 });

  const session = await prisma.practiceSession.create({
    data: {
      userId: user.id,
      scenarioId: scenario.id,
      durationSeconds: Number(durationSeconds) || 0,
      transcript: typeof transcript === "string" ? transcript : "",
      recordingLabel
    }
  });

  const feedback = generateFeedback(typeof transcript === "string" ? transcript : "", user.language, analysis);

  await prisma.feedback.create({
    data: {
      practiceSessionId: session.id,
      confidence: feedback.confidence,
      clarity: feedback.clarity,
      pace: feedback.pace,
      energy: feedback.energy,
      fillerWords: feedback.fillerWords,
      summary: feedback.summary,
      improvementTips: JSON.stringify(feedback.tips),
      language: user.language
    }
  });

  return NextResponse.json({ ok: true, sessionId: session.id, feedback });
}
