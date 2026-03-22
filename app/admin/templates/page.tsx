import { AdminScriptManager } from "@/components/admin-script-manager";
import { requireAdmin } from "@/lib/auth";
import { getAdminContext } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminTemplatesPage() {
  const user = await requireAdmin();
  const { copy } = await getAdminContext(user.language);

  const [templates, scenarios] = await Promise.all([
    prisma.scriptTemplate.findMany({ include: { scenario: true }, orderBy: [{ scenarioId: "asc" }, { language: "asc" }] }),
    prisma.promptScenario.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true, slug: true } })
  ]);

  return <AdminScriptManager copy={copy} templates={templates} scenarios={scenarios} />;
}
