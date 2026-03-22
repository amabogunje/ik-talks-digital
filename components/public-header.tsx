import Link from "next/link";
import { Logo } from "@/components/logo";
import { LanguageSelect } from "@/components/language-select";
import { Dictionary } from "@/lib/i18n";
import { SupportedLanguage } from "@/lib/locale";

export function PublicHeader({ language, dict }: { language: SupportedLanguage; dict: Dictionary }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
      <div className="flex items-center justify-between gap-3 sm:w-auto">
        <Logo />
        <div className="sm:hidden">
          <LanguageSelect value={language} compact />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end sm:gap-5">
        <div className="flex items-center gap-4 text-sm tracking-[0.01em] text-zinc-300 sm:gap-5">
          <Link href="/login" className="transition hover:text-white">
            {dict.login}
          </Link>
          <Link href="/signup" className="transition hover:text-white">
            {dict.signup}
          </Link>
        </div>
        <div className="hidden sm:block">
          <LanguageSelect value={language} />
        </div>
      </div>
    </div>
  );
}
