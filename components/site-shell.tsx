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
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <Logo />
          <nav className="flex flex-wrap items-center gap-3 text-sm text-zinc-300 lg:gap-6">
            <Link href="/dashboard">{dict.dashboard}</Link>
            <Link href="/courses">{dict.courses}</Link>
            <Link href="/practice">{dict.practice}</Link>
            <Link href="/scripts">{dict.scripts}</Link>
            {role === "ADMIN" ? <Link href="/admin">{dict.admin}</Link> : null}
            <LanguageSelect value={language} />
            <form action="/api/auth/logout" method="post">
              <button className="rounded-full border border-gold/40 px-4 py-2 text-gold transition hover:bg-gold hover:text-black">
                {dict.logout}
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
