import Link from "next/link";
import { Language, Role } from "@prisma/client";
import { getDictionary } from "@/lib/i18n";
import { Logo } from "@/components/logo";
import { LanguageSelect } from "@/components/language-select";

type Props = {
  language: Language;
  role: Role;
  children: React.ReactNode;
};

export function SiteShell({ language, role, children }: Props) {
  const dict = getDictionary(language);

  return (
    <div className="min-h-screen bg-aura text-white">
      <header className="border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <Logo />
              <div className="flex items-center gap-2 sm:gap-3">
                <LanguageSelect value={language} compact />
                <form action="/api/auth/logout" method="post">
                  <button className="rounded-full border border-gold/40 px-3 py-2 text-sm text-gold transition hover:bg-gold hover:text-black sm:px-4">
                    {dict.logout}
                  </button>
                </form>
              </div>
            </div>
            <nav className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 text-sm text-zinc-300 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Link href="/dashboard" className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2">{dict.dashboard}</Link>
              <Link href="/courses" className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2">{dict.courses}</Link>
              <Link href="/practice" className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2">{dict.practice}</Link>
              <Link href="/scripts" className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2">{dict.scripts}</Link>
              {role === "ADMIN" ? <Link href="/admin" className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2">{dict.admin}</Link> : null}
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
