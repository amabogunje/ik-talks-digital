import { prisma } from "@/lib/prisma";
import { percent } from "@/lib/utils";

function averageScore(feedback?: { confidence: number; clarity: number; pace: number; energy: number } | null) {
  if (!feedback) return null;
  return Math.round((feedback.confidence + feedback.clarity + feedback.pace + feedback.energy) / 4);
}

function parseTips(value: string | null | undefined) {
  if (!value) return [] as string[];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function getCurrentLesson<T extends { title: string; slug: string; order: number }>(lessons: T[], lessonsCompleted: number) {
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);
  return sortedLessons[lessonsCompleted] ?? sortedLessons[sortedLessons.length - 1] ?? null;
}

function getTrendStatus(delta: number | null, score: number) {
  if (delta !== null && delta > 3) return "up" as const;
  if (delta !== null && delta > 0) return "improving" as const;
  if (score < 70) return "needs work" as const;
  return "steady" as const;
}

function getImprovementMetric(latest: { confidence: number; clarity: number; pace: number; energy: number } | null, previous: { confidence: number; clarity: number; pace: number; energy: number } | null) {
  if (!latest || !previous) return null;

  const deltas = [
    { label: "confidence", value: latest.confidence - previous.confidence },
    { label: "clarity", value: latest.clarity - previous.clarity },
    { label: "pace", value: latest.pace - previous.pace },
    { label: "energy", value: latest.energy - previous.energy }
  ].sort((a, b) => b.value - a.value);

  return deltas[0]?.value > 0 ? deltas[0] : null;
}

export async function getDashboardData(userId: string, language: string) {
  const [enrollments, sessions, feedbackHistory, courses] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: { course: { include: { lessons: true } } },
      orderBy: { updatedAt: "desc" }
    }),
    prisma.practiceSession.count({ where: { userId } }),
    prisma.feedback.findMany({
      where: { practiceSession: { userId } },
      orderBy: { createdAt: "desc" },
      take: 2,
      include: { practiceSession: { include: { scenario: true } } }
    }),
    prisma.course.findMany({
      where: { published: true },
      include: { lessons: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "asc" },
      take: 3
    })
  ]);

  const enrichedEnrollments = enrollments.map((enrollment) => ({
    ...enrollment,
    computedProgress: enrollment.progressPercent || percent(enrollment.lessonsCompleted, enrollment.course.lessons.length),
    currentLesson: getCurrentLesson(enrollment.course.lessons, enrollment.lessonsCompleted)
  }));

  const activeEnrollment = enrichedEnrollments[0] ?? null;
  const latestFeedback = feedbackHistory[0] ?? null;
  const previousFeedback = feedbackHistory[1] ?? null;
  const latestScore = averageScore(latestFeedback);
  const latestTips = parseTips(latestFeedback?.improvementTips);

  const confidenceDelta = latestFeedback && previousFeedback ? latestFeedback.confidence - previousFeedback.confidence : null;
  const clarityDelta = latestFeedback && previousFeedback ? latestFeedback.clarity - previousFeedback.clarity : null;
  const paceDelta = latestFeedback && previousFeedback ? latestFeedback.pace - previousFeedback.pace : null;

  const isFrench = language === "FR";
  const recommendedCourse = courses[0] ?? null;
  const recommendedLesson = recommendedCourse ? getCurrentLesson(recommendedCourse.lessons, 0) : null;
  const recommendedProgress = recommendedCourse ? percent(0, recommendedCourse.lessons.length) : 0;

  return {
    enrollments: enrichedEnrollments,
    activeEnrollment,
    practiceSessionsCount: sessions,
    latestFeedback,
    previousFeedback,
    latestScore,
    latestTip: latestTips[0] ?? null,
    improvementMetric: getImprovementMetric(latestFeedback, previousFeedback),
    recommendedCourse,
    courses,
    trends: latestFeedback
      ? [
          { label: "confidence", status: getTrendStatus(confidenceDelta, latestFeedback.confidence) },
          { label: "clarity", status: getTrendStatus(clarityDelta, latestFeedback.clarity) },
          { label: "pace", status: getTrendStatus(paceDelta, latestFeedback.pace) }
        ]
      : [],
    currentFocus: activeEnrollment
      ? {
          courseTitle: activeEnrollment.course.title,
          courseThumbnail: activeEnrollment.course.thumbnail,
          focusText: activeEnrollment.currentLesson
            ? isFrench
              ? `Continuez avec ${activeEnrollment.currentLesson.title}.`
              : `Continue with ${activeEnrollment.currentLesson.title}.`
            : isFrench
              ? `Continuez a progresser dans ${activeEnrollment.course.title}.`
              : `Continue building momentum inside ${activeEnrollment.course.title}.`,
          progressPercent: activeEnrollment.computedProgress,
          href: activeEnrollment.currentLesson ? `/learn/${activeEnrollment.course.slug}/${activeEnrollment.currentLesson.slug}` : `/courses/${activeEnrollment.course.slug}`
        }
      : recommendedCourse
        ? {
            courseTitle: recommendedCourse.title,
            courseThumbnail: recommendedCourse.thumbnail,
            focusText: recommendedLesson
              ? isFrench
                ? `Commencez avec ${recommendedLesson.title}.`
                : `Start with ${recommendedLesson.title}.`
              : isFrench
                ? "Commencez votre parcours avec ce cours recommande."
                : "Start your journey with this recommended course.",
            progressPercent: recommendedProgress,
            href: recommendedLesson ? `/learn/${recommendedCourse.slug}/${recommendedLesson.slug}` : `/courses/${recommendedCourse.slug}`
          }
        : null
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
