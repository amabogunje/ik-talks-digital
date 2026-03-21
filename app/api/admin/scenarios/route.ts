import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  await requireAdmin();
  const { title, slug, description, guidance } = await request.json();

  const scenario = await prisma.promptScenario.create({
    data: { title, slug, description, guidance }
  });

  return NextResponse.json({ ok: true, scenario });
}
