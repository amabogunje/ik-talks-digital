import { AdminCourseManager } from "@/components/admin-course-manager";
import { requireAdmin } from "@/lib/auth";
import { getAdminContext } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminCoursesPage() {
  const user = await requireAdmin();
  const { copy } = await getAdminContext(user.language);

  const courses = await prisma.course.findMany({
    include: {
      lessons: {
        orderBy: { order: "asc" }
      }
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
  });

  return <AdminCourseManager copy={copy} courses={courses} />;
}
