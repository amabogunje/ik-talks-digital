import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  await requireAdmin();
  const { title, slug, description, thumbnail } = await request.json();

  const course = await prisma.course.create({
    data: {
      title,
      slug,
      description,
      thumbnail,
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
