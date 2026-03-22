import { redirect } from "next/navigation";
import { AdminSubnav } from "@/components/admin-subnav";
import { SiteShell } from "@/components/site-shell";
import { requireAdmin } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { getAdminContext } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  if (!user) redirect("/dashboard");

  const dict = getDictionary(user.language);
  const { language, copy } = await getAdminContext(user.language);

  return (
    <SiteShell language={language} role={user.role}>
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-gold">{dict.adminPanel}</p>
        <h1 className="font-display text-5xl text-white">{copy.workspaceTitle}</h1>
        <p className="max-w-3xl text-base leading-7 text-zinc-400">{copy.workspaceIntro}</p>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-6">
          <AdminSubnav
            items={[
              { href: "/admin/courses", label: copy.coursesNav },
              { href: "/admin/scenarios", label: copy.scenariosNav },
              { href: "/admin/templates", label: copy.templatesNav },
              { href: "/admin/recommends", label: copy.recommendsNav }
            ]}
          />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </SiteShell>
  );
}
