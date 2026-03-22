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
      <header className="border-b border-white/10 bg-black/85 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="flex items-center justify-between gap-3 lg:flex-1">
              <Logo />
              <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
                <LanguageSelect value={language} compact />
                <form action="/api/auth/logout" method="post">
                  <button className="button-accent-outline px-3 py-2 text-sm sm:px-4">
                    {dict.logout}
                  </button>
                </form>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-1 lg:flex-row lg:items-center lg:justify-end lg:gap-7">
              <nav className="-mx-1 flex items-center gap-4 overflow-x-auto px-1 text-sm tracking-[0.01em] text-zinc-300 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-wrap lg:justify-end lg:gap-6 lg:px-0">
                <Link href="/dashboard" className="whitespace-nowrap transition hover:text-white">{dict.dashboard}</Link>
                <Link href="/courses" className="whitespace-nowrap transition hover:text-white">{dict.courses}</Link>
                <Link href="/practice" className="whitespace-nowrap transition hover:text-white">{dict.practice}</Link>
                <Link href="/scripts" className="whitespace-nowrap transition hover:text-white">{dict.scripts}</Link>
                {role === "ADMIN" ? <Link href="/admin" className="whitespace-nowrap transition hover:text-white">{dict.admin}</Link> : null}
              </nav>

              <div className="hidden items-center gap-3 lg:flex">
                <LanguageSelect value={language} compact />
                <form action="/api/auth/logout" method="post">
                  <button className="button-accent-outline px-4 py-2 text-sm">
                    {dict.logout}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">{children}</main>
    </div>
  );
}
