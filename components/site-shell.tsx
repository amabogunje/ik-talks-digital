import { Language, Role } from "@prisma/client";
import { getDictionary } from "@/lib/i18n";
import { Logo } from "@/components/logo";
import { LanguageSelect } from "@/components/language-select";
import { SiteNav } from "@/components/site-nav";

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
        <div className="mx-auto max-w-[88rem] px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
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

            <div className="flex flex-col gap-3 lg:flex-[1.4] lg:flex-row lg:items-center lg:justify-end lg:gap-8">
              <SiteNav
                items={[
                  { href: "/dashboard", label: dict.dashboard },
                  { href: "/courses", label: dict.courses },
                  { href: "/practice", label: dict.practice },
                  { href: "/scripts", label: dict.scripts },
                  ...(role === "ADMIN" ? [{ href: "/admin", label: dict.admin }] : [])
                ]}
              />

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
