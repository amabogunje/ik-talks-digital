import { CourseLevel, CourseSkillArea } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function toBoolean(value: unknown) {
  return value === true || value === "true" || value === "on";
}

export async function POST(request: Request) {
  await requireAdmin();
  const { title, slug, description, thumbnail, featured, published, skillArea, level } = await request.json();

  const course = await prisma.course.create({
    data: {
      title,
      slug,
      description,
      thumbnail,
      featured: toBoolean(featured),
      published: published === undefined ? true : toBoolean(published),
      skillArea: Object.values(CourseSkillArea).includes(skillArea) ? skillArea : CourseSkillArea.PUBLIC_SPEAKING,
      level: Object.values(CourseLevel).includes(level) ? level : CourseLevel.BEGINNER,
      lessons: {
        create: [{
          title: "New lesson 1",
          slug: "new-lesson-1",
          description: "Placeholder lesson for MVP admin flow.",
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          durationMin: 8,
          order: 1
        }]
      }
    }
  });

  return NextResponse.json({ ok: true, course });
}