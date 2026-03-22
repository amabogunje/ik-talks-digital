import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function toInt(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function POST(request: Request) {
  await requireAdmin();
  const { id, courseId, title, slug, description, videoUrl, durationMin, order } = await request.json();

  if (!courseId) {
    return NextResponse.json({ ok: false, error: "Course id is required." }, { status: 400 });
  }

  try {
    const data = {
      courseId,
      title,
      slug,
      description,
      videoUrl,
      durationMin: toInt(durationMin, 5),
      order: toInt(order, 1)
    };

    const lesson = id
      ? await prisma.lesson.update({ where: { id }, data })
      : await prisma.lesson.create({ data });

    return NextResponse.json({ ok: true, lesson });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unable to save lesson." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  await requireAdmin();
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ ok: false, error: "Lesson id is required." }, { status: 400 });
  }

  try {
    await prisma.lesson.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unable to delete lesson." }, { status: 400 });
  }
}
