import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;

  const existing = await prisma.scriptRequest.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ ok: false, error: "Script not found." }, { status: 404 });
  }

  await prisma.scriptRequest.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
