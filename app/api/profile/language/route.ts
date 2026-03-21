import { NextResponse } from "next/server";
import { Language } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PUBLIC_LANGUAGE_COOKIE, normalizeLanguage } from "@/lib/locale";

export async function POST(request: Request) {
  const { language } = await request.json();
  const targetLanguage = normalizeLanguage((language as Language) ?? Language.EN);
  const user = await getCurrentUser();

  if (user) {
    await prisma.user.update({ where: { id: user.id }, data: { language: targetLanguage } });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(PUBLIC_LANGUAGE_COOKIE, targetLanguage, {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
    path: "/"
  });

  return response;
}
