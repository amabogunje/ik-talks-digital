import { NextResponse } from "next/server";
import { Language } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateScript } from "@/lib/scripts";

export async function POST(request: Request) {
  const user = await requireUser();
  const { scenarioSlug, language, tone, audience, length, additionalContext } = await request.json();

  const scenario = await prisma.promptScenario.findUnique({ where: { slug: scenarioSlug }, include: { templates: true } });
  if (!scenario) return NextResponse.json({ error: "Scenario not found." }, { status: 404 });

  const targetLanguage = (language as Language) ?? user.language;
  const template = scenario.templates.find((item) => item.language === targetLanguage && item.tone === tone && item.audience === audience)?.template;

  const output = generateScript({
    scenarioTitle: scenario.title,
    tone,
    audience,
    length,
    language: targetLanguage,
    template,
    additionalContext
  });

  return NextResponse.json({
    ok: true,
    output,
    scenario: {
      id: scenario.id,
      title: scenario.title,
      slug: scenario.slug
    }
  });
}
