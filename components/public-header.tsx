import Link from "next/link";
import { Logo } from "@/components/logo";
import { LanguageSelect } from "@/components/language-select";
import { Dictionary } from "@/lib/i18n";
import { SupportedLanguage } from "@/lib/locale";

export function PublicHeader({ language, dict }: { language: SupportedLanguage; dict: Dictionary }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="rounded-full border border-white/10 bg-black/20 px-5 py-3 backdrop-blur">
        <Logo />
      </div>
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm text-zinc-300 transition hover:text-white">
          {dict.login}
        </Link>
        <Link href="/signup" className="text-sm text-zinc-300 transition hover:text-white">
          {dict.signup}
        </Link>
        <LanguageSelect value={language} />
      </div>
    </div>
  );
}
