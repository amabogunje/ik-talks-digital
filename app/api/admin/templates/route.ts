import { Language } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  await requireAdmin();
  const { id, scenarioId, language, tone, audience, template } = await request.json();

  if (!scenarioId) {
    return NextResponse.json({ ok: false, error: "Scenario is required." }, { status: 400 });
  }

  try {
    const item = id
      ? await prisma.scriptTemplate.update({
          where: { id },
          data: {
            scenarioId,
            language: language as Language,
            tone,
            audience,
            template
          },
          include: { scenario: true }
        })
      : await prisma.scriptTemplate.create({
          data: {
            scenarioId,
            language: language as Language,
            tone,
            audience,
            template
          },
          include: { scenario: true }
        });

    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unable to save template." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  await requireAdmin();
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ ok: false, error: "Template id is required." }, { status: 400 });
  }

  try {
    await prisma.scriptTemplate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unable to delete template." }, { status: 400 });
  }
}
