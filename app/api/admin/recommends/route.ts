import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const validContentTypes = new Set(["video", "article", "podcast", "tool"]);
const validCategories = new Set([
  "presence-confidence",
  "voice-delivery",
  "storytelling-structure",
  "audience-engagement",
  "hosting-skills",
  "business-speaking"
]);

function toBoolean(value: unknown, fallback = false) {
  if (value === undefined || value === null) return fallback;
  return value === true || value === "true" || value === "on";
}

export async function POST(request: Request) {
  await requireAdmin();
  const payload = await request.json();

  const data = {
    titleEn: String(payload.titleEn ?? "").trim(),
    titleFr: String(payload.titleFr ?? payload.titleEn ?? "").trim(),
    source: String(payload.source ?? "").trim(),
    contentType: validContentTypes.has(payload.contentType) ? payload.contentType : "video",
    category: validCategories.has(payload.category) ? payload.category : "presence-confidence",
    summaryEn: String(payload.summaryEn ?? "").trim(),
    summaryFr: String(payload.summaryFr ?? payload.summaryEn ?? "").trim(),
    ikNoteEn: String(payload.ikNoteEn ?? "").trim(),
    ikNoteFr: String(payload.ikNoteFr ?? payload.ikNoteEn ?? "").trim(),
    estimatedLength: String(payload.estimatedLength ?? "").trim(),
    url: String(payload.url ?? "").trim(),
    thumbnail: String(payload.thumbnail ?? "").trim(),
    featured: toBoolean(payload.featured),
    active: toBoolean(payload.active, true),
    sortOrder: Number(payload.sortOrder ?? 0) || 0
  };

  if (!data.titleEn || !data.source || !data.summaryEn || !data.ikNoteEn || !data.url || !data.thumbnail) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (payload.id) {
    const item = await prisma.recommendationResource.update({
      where: { id: String(payload.id) },
      data
    });

    return NextResponse.json({ ok: true, item });
  }

  const item = await prisma.recommendationResource.create({ data });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(request: Request) {
  await requireAdmin();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Recommendation id is required." }, { status: 400 });
  }

  await prisma.recommendationResource.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
