import { AdminScenarioManager } from "@/components/admin-scenario-manager";
import { requireAdmin } from "@/lib/auth";
import { getAdminContext } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminScenariosPage() {
  const user = await requireAdmin();
  const { copy } = await getAdminContext(user.language);

  const scenarios = await prisma.promptScenario.findMany({ orderBy: [{ active: "desc" }, { createdAt: "desc" }] });

  return <AdminScenarioManager copy={copy} scenarios={scenarios} />;
}
