import { NextResponse } from "next/server";
import { Language } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  await requireAdmin();
  const { scenarioSlug, language, tone, audience, template } = await request.json();

  const scenario = await prisma.promptScenario.findUnique({ where: { slug: scenarioSlug } });
  if (!scenario) return NextResponse.json({ error: "Scenario not found." }, { status: 404 });

  const item = await prisma.scriptTemplate.create({
    data: {
      scenarioId: scenario.id,
      language: language as Language,
      tone,
      audience,
      template
    }
  });

  return NextResponse.json({ ok: true, item });
}
