import { cookies } from "next/headers";
import { Language } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";

export const PUBLIC_LANGUAGE_COOKIE = "ik_talks_language";
export type SupportedLanguage = "EN" | "FR";

export function isLanguage(value: string | undefined | null): value is Language {
  return value === "EN" || value === "FR" || value === "PIDGIN";
}

export function normalizeLanguage(language: Language | string | undefined | null): SupportedLanguage {
  return language === "FR" ? "FR" : "EN";
}

export async function getPreferredLanguage(): Promise<SupportedLanguage> {
  const user = await getCurrentUser();
  if (user?.language) return normalizeLanguage(user.language);

  const cookieStore = await cookies();
  const cookieLanguage = cookieStore.get(PUBLIC_LANGUAGE_COOKIE)?.value;
  return normalizeLanguage(isLanguage(cookieLanguage) ? cookieLanguage : "EN");
}
