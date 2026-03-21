import { prisma } from "@/lib/prisma";
import { percent } from "@/lib/utils";

export async function getDashboardData(userId: string) {
  const [enrollments, sessions, latestFeedback, scenarios, courses] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: { course: { include: { lessons: true } } },
      orderBy: { updatedAt: "desc" }
    }),
    prisma.practiceSession.count({ where: { userId } }),
    prisma.feedback.findFirst({
      where: { practiceSession: { userId } },
      orderBy: { createdAt: "desc" },
      include: { practiceSession: { include: { scenario: true } } }
    }),
    prisma.promptScenario.findMany({ where: { active: true }, orderBy: { title: "asc" } }),
    prisma.course.findMany({ where: { published: true }, include: { lessons: true }, orderBy: { createdAt: "asc" } })
  ]);

  return {
    enrollments: enrollments.map((enrollment) => ({
      ...enrollment,
      computedProgress: enrollment.progressPercent || percent(enrollment.lessonsCompleted, enrollment.course.lessons.length)
    })),
    practiceSessionsCount: sessions,
    latestFeedback,
    scenarios,
    courses
  };
}

export async function getCourseBySlug(slug: string, userId?: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: { orderBy: { order: "asc" } },
      enrollments: userId ? { where: { userId } } : false
    }
  });
}
