import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function toBoolean(value: unknown) {
  return value === true || value === "true" || value === "on";
}

export async function POST(request: Request) {
  await requireAdmin();
  const { id, title, slug, description, guidance, active } = await request.json();

  try {
    const scenario = id
      ? await prisma.promptScenario.update({
          where: { id },
          data: { title, slug, description, guidance, active: active === undefined ? true : toBoolean(active) }
        })
      : await prisma.promptScenario.create({
          data: { title, slug, description, guidance, active: active === undefined ? true : toBoolean(active) }
        });

    return NextResponse.json({ ok: true, scenario });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unable to save scenario." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  await requireAdmin();
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ ok: false, error: "Scenario id is required." }, { status: 400 });
  }

  try {
    await prisma.promptScenario.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unable to delete scenario." }, { status: 400 });
  }
}
