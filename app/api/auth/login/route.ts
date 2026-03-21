import { NextResponse } from "next/server";
import { createSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
