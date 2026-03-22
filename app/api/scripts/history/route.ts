import { NextResponse } from "next/server";
import { Language } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await requireUser();
  const { title, scenarioSlug, language, tone, audience, length, output } = await request.json();

  if (!String(title ?? "").trim()) {
    return NextResponse.json({ ok: false, error: "Script title is required." }, { status: 400 });
  }

  const scenario = await prisma.promptScenario.findUnique({ where: { slug: scenarioSlug } });
  if (!scenario) {
    return NextResponse.json({ ok: false, error: "Scenario not found." }, { status: 404 });
  }

  const saved = await prisma.scriptRequest.create({
    data: {
      userId: user.id,
      scenarioId: scenario.id,
      title: String(title).trim(),
      language: language as Language,
      tone,
      audience,
      length,
      output
    }
  });

  return NextResponse.json({
    ok: true,
    savedRequest: {
      ...saved,
      scenario: {
        id: scenario.id,
        title: scenario.title,
        slug: scenario.slug
      }
    }
  });
}
