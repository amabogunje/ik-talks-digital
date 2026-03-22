import { notFound } from "next/navigation";
import { AdminLessonManager } from "@/components/admin-lesson-manager";
import { requireAdmin } from "@/lib/auth";
import { getAdminContext } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminCourseLessonsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const user = await requireAdmin();
  const { copy } = await getAdminContext(user.language);
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { order: "asc" }
      }
    }
  });

  if (!course) notFound();

  return <AdminLessonManager copy={copy} course={course} />;
}
