import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonCompleteButton } from "@/components/lesson-complete-button";
import { VideoPlayer } from "@/components/video-player";
import { SiteShell } from "@/components/site-shell";
import { getCourseBySlug } from "@/lib/data";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { normalizeLanguage } from "@/lib/locale";
import { translateCourseText, translateLessonsText } from "@/lib/translation";

export default async function LessonPage({ params }: { params: Promise<{ courseSlug: string; lessonSlug: string }> }) {
  const user = await requireUser();
  const language = normalizeLanguage(user.language);
  const dict = getDictionary(language);
  const { courseSlug, lessonSlug } = await params;
  const course = await getCourseBySlug(courseSlug, user.id);

  if (!course) notFound();

  const lessons = await translateLessonsText(course.lessons, language);
  const lesson = lessons.find((item) => item.slug === lessonSlug);
  if (!lesson) notFound();

  const [translatedCourse] = await translateCourseText([course], language);
  const nextLesson = lessons.find((item) => item.order === lesson.order + 1);

  return (
    <SiteShell language={language} role={user.role}>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-gold">{translatedCourse.title}</p>
          <h1 className="mt-4 font-display text-5xl text-white">{lesson.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">{lesson.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LessonCompleteButton lessonId={course.lessons.find((item) => item.slug === lesson.slug)?.id ?? ""} text={{ saving: dict.saving, markLessonComplete: dict.markLessonComplete }} />
            {nextLesson ? (
              <Link href={`/learn/${course.slug}/${nextLesson.slug}`} className="button-secondary px-5">
                {dict.nextLesson}
              </Link>
            ) : null}
            <Link href="/dashboard" className="button-secondary px-5">
              {dict.backToDashboard}
            </Link>
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-[#111111] p-6">
          <VideoPlayer src={lesson.videoUrl} title={lesson.title} text={{ readyToPlay: dict.readyToPlay, loading: dict.loading }} />
          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-5 text-sm leading-7 text-zinc-300">
            {dict.lessonCta}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
