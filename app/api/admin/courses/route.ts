import { CourseLevel, CourseSkillArea } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function toBoolean(value: unknown) {
  return value === true || value === "true" || value === "on";
}

const courseInclude = {
  lessons: {
    orderBy: { order: "asc" as const }
  }
};

export async function POST(request: Request) {
  await requireAdmin();
  const { id, title, slug, description, thumbnail, featured, published, skillArea, level } = await request.json();

  try {
    const data = {
      title,
      slug,
      description,
      thumbnail,
      featured: toBoolean(featured),
      published: published === undefined ? true : toBoolean(published),
      skillArea: Object.values(CourseSkillArea).includes(skillArea) ? skillArea : CourseSkillArea.PUBLIC_SPEAKING,
      level: Object.values(CourseLevel).includes(level) ? level : CourseLevel.BEGINNER
    };

    const course = id
      ? await prisma.course.update({ where: { id }, data, include: courseInclude })
      : await prisma.course.create({ data, include: courseInclude });

    return NextResponse.json({ ok: true, course });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unable to save course." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  await requireAdmin();
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ ok: false, error: "Course id is required." }, { status: 400 });
  }

  try {
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unable to delete course." }, { status: 400 });
  }
}
