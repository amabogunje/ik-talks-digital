import Link from "next/link";
import { Logo } from "@/components/logo";
import { LanguageSelect } from "@/components/language-select";
import { Dictionary } from "@/lib/i18n";
import { SupportedLanguage } from "@/lib/locale";

export function PublicHeader({ language, dict }: { language: SupportedLanguage; dict: Dictionary }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-3 backdrop-blur sm:w-auto sm:rounded-full sm:px-5">
        <Logo />
        <div className="sm:hidden">
          <LanguageSelect value={language} compact />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-3 backdrop-blur sm:justify-end sm:rounded-full sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-zinc-300 transition hover:text-white">
            {dict.login}
          </Link>
          <Link href="/signup" className="text-sm text-zinc-300 transition hover:text-white">
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
