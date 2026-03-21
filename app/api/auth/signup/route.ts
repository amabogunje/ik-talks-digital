import { NextResponse } from "next/server";
import { Language } from "@prisma/client";
import { createSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { name, email, password, language } = await request.json();
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      language: (language as Language) ?? Language.EN
    }
  });

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
