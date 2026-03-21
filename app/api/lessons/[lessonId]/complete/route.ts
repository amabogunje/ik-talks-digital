import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { percent } from "@/lib/utils";

export async function POST(_request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const user = await requireUser();
  const { lessonId } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: { include: { lessons: true } } }
  });

  if (!lesson) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    create: { userId: user.id, lessonId, completed: true, completedAt: new Date() },
    update: { completed: true, completedAt: new Date() }
  });

  const completedLessons = await prisma.lessonProgress.count({
    where: { userId: user.id, lesson: { courseId: lesson.courseId }, completed: true }
  });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId: lesson.courseId } },
    create: {
      userId: user.id,
      courseId: lesson.courseId,
      lessonsCompleted: completedLessons,
      progressPercent: percent(completedLessons, lesson.course.lessons.length)
    },
    update: {
      lessonsCompleted: completedLessons,
      progressPercent: percent(completedLessons, lesson.course.lessons.length)
    }
  });

  return NextResponse.json({ ok: true });
}
