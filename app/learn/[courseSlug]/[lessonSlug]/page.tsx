import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonCompleteButton } from "@/components/lesson-complete-button";
import { SiteShell } from "@/components/site-shell";
import { VideoPlayer } from "@/components/video-player";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { normalizeLanguage } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { translateLessonsText } from "@/lib/translation";

export default async function LessonPage({ params }: { params: Promise<{ courseSlug: string; lessonSlug: string }> }) {
  const user = await requireUser();
  const language = normalizeLanguage(user.language);
  const dict = getDictionary(language);
  const { courseSlug, lessonSlug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: { lessons: { orderBy: { order: "asc" } } }
  });

  if (!course) notFound();

  const translatedLessons = await translateLessonsText(course.lessons, language);
  const lesson = translatedLessons.find((entry) => entry.slug === lessonSlug);
  if (!lesson) notFound();

  const currentIndex = translatedLessons.findIndex((entry) => entry.id === lesson.id);
  const nextLesson = translatedLessons[currentIndex + 1];

  return (
    <SiteShell language={language} role={user.role}>
      <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gold">{course.title}</p>
            <h1 className="mt-4 font-display text-5xl text-white">{lesson.title}</h1>
            <p className="mt-4 text-lg leading-8 text-zinc-300">{lesson.description}</p>
          </div>
          <VideoPlayer src={lesson.videoUrl} title={lesson.title} text={{ readyToPlay: dict.readyToPlay, loading: dict.loading }} />
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">{dict.lessonActions}</p>
          <div className="mt-5">
            <LessonCompleteButton lessonId={lesson.id} text={{ saving: dict.saving, markLessonComplete: dict.markLessonComplete }} />
          </div>
          {nextLesson ? (
            <Link href={`/learn/${course.slug}/${nextLesson.slug}`} className="mt-4 inline-flex rounded-full border border-white/10 px-5 py-3 text-white">{dict.nextLesson}</Link>
          ) : (
            <Link href="/dashboard" className="mt-4 inline-flex rounded-full border border-white/10 px-5 py-3 text-white">{dict.backToDashboard}</Link>
          )}
          <Link href="/scripts" className="mt-4 block rounded-[1.5rem] border border-gold/20 bg-gold/10 p-5 text-sm leading-6 text-zinc-200">
            {dict.lessonCta}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
