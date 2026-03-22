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

type OrderedLesson = {
  id: string;
  title: string;
  description: string;
  slug: string;
  order: number;
  durationMin?: number;
  progress?: Array<{ completed: boolean }>;
};

function sortLessons<T extends OrderedLesson>(lessons: T[]) {
  return [...lessons].sort((a, b) => a.order - b.order);
}

function getCurrentLesson<T extends OrderedLesson>(lessons: T[], lessonsCompleted: number) {
  const sortedLessons = sortLessons(lessons);
  return sortedLessons[lessonsCompleted] ?? sortedLessons[sortedLessons.length - 1] ?? null;
}

function getFirstIncompleteLesson<T extends OrderedLesson>(lessons: T[]) {
  const sortedLessons = sortLessons(lessons);
  return sortedLessons.find((lesson) => !lesson.progress?.some((entry) => entry.completed)) ?? sortedLessons[sortedLessons.length - 1] ?? null;
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

function buildCourseState(course: {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  lessons: OrderedLesson[];
  enrollments: Array<{
    id: string;
    updatedAt: Date;
    progressPercent: number;
    lessonsCompleted: number;
  }>;
}) {
  const enrollment = course.enrollments[0] ?? null;
  const sortedLessons = sortLessons(course.lessons);
  const lessonsCount = sortedLessons.length;
  const durationMin = sortedLessons.reduce((sum, lesson) => sum + (lesson.durationMin ?? 0), 0);
  const lessonsCompleted = enrollment?.lessonsCompleted ?? 0;
  const progressPercent = enrollment?.progressPercent || percent(lessonsCompleted, lessonsCount);
  const status = !enrollment || lessonsCompleted === 0
    ? "not_started"
    : progressPercent >= 100 || lessonsCompleted >= lessonsCount
      ? "completed"
      : "in_progress";
  const currentLesson = status === "not_started"
    ? sortedLessons[0] ?? null
    : getCurrentLesson(sortedLessons, lessonsCompleted);

  return {
    ...course,
    enrollment,
    lessons: sortedLessons,
    lessonsCount,
    durationMin,
    lessonsCompleted,
    progressPercent,
    status,
    currentLesson,
    resumeHref: currentLesson ? `/learn/${course.slug}/${currentLesson.slug}` : `/courses/${course.slug}`,
    detailHref: `/courses/${course.slug}`
  };
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

  const enrichedEnrollments = enrollments.map((enrollment) => {
    const computedProgress = enrollment.progressPercent || percent(enrollment.lessonsCompleted, enrollment.course.lessons.length);
    const status = enrollment.lessonsCompleted === 0
      ? "not_started"
      : computedProgress >= 100 || enrollment.lessonsCompleted >= enrollment.course.lessons.length
        ? "completed"
        : "in_progress";

    return {
      ...enrollment,
      computedProgress,
      status,
      currentLesson: getCurrentLesson(enrollment.course.lessons, enrollment.lessonsCompleted)
    };
  });

  const activeEnrollment = enrichedEnrollments.find((enrollment) => enrollment.status === "in_progress") ?? null;
  const latestFeedback = feedbackHistory[0] ?? null;
  const previousFeedback = feedbackHistory[1] ?? null;
  const latestScore = averageScore(latestFeedback);
  const latestTips = parseTips(latestFeedback?.improvementTips);

  const confidenceDelta = latestFeedback && previousFeedback ? latestFeedback.confidence - previousFeedback.confidence : null;
  const clarityDelta = latestFeedback && previousFeedback ? latestFeedback.clarity - previousFeedback.clarity : null;
  const paceDelta = latestFeedback && previousFeedback ? latestFeedback.pace - previousFeedback.pace : null;

  const isFrench = language === "FR";
  const recommendedCourse = courses[0] ?? null;
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
          kind: "active" as const,
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
            kind: "recommended" as const,
            courseTitle: recommendedCourse.title,
            courseThumbnail: recommendedCourse.thumbnail,
            focusText: null,
            progressPercent: recommendedProgress,
            href: `/courses/${recommendedCourse.slug}`
          }
        : null
  };
}

export async function getCourseLibraryData(userId: string) {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      lessons: { orderBy: { order: "asc" } },
      enrollments: { where: { userId }, orderBy: { updatedAt: "desc" }, take: 1 }
    },
    orderBy: { createdAt: "asc" }
  });

  const courseStates = courses.map((course) => buildCourseState(course));

  return {
    allCourses: courseStates,
    myCourses: courseStates.filter((course) => course.status === "in_progress"),
    completedCourses: courseStates.filter((course) => course.status === "completed"),
    availableCourses: courseStates.filter((course) => course.status === "not_started")
  };
}

export async function getCourseBySlug(slug: string, userId?: string) {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: {
          progress: userId ? { where: { userId } } : false
        }
      },
      enrollments: userId ? { where: { userId }, take: 1 } : false
    }
  });

  if (!course) return null;

  const enrollment = Array.isArray(course.enrollments) ? course.enrollments[0] ?? null : null;
  const completedLessons = course.lessons.filter((lesson) => lesson.progress.some((entry) => entry.completed)).length;
  const progressPercent = enrollment?.progressPercent || percent(completedLessons, course.lessons.length);
  const status = !enrollment || completedLessons === 0
    ? "not_started"
    : progressPercent >= 100 || completedLessons >= course.lessons.length
      ? "completed"
      : "in_progress";
  const currentLesson = status === "not_started"
    ? course.lessons[0] ?? null
    : getFirstIncompleteLesson(course.lessons);
  const durationMin = course.lessons.reduce((sum, lesson) => sum + lesson.durationMin, 0);

  return {
    ...course,
    enrollment,
    completedLessons,
    progressPercent,
    status,
    currentLesson,
    durationMin,
    resumeHref: currentLesson ? `/learn/${course.slug}/${currentLesson.slug}` : `/courses/${course.slug}`
  };
}

