import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { getCourseBySlug } from "@/lib/data";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { normalizeLanguage } from "@/lib/locale";
import { translateCourseText, translateLessonsText } from "@/lib/translation";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await requireUser();
  const language = normalizeLanguage(user.language);
  const dict = getDictionary(language);
  const { slug } = await params;
  const course = await getCourseBySlug(slug, user.id);

  if (!course) notFound();

  const [translatedCourse] = await translateCourseText([course], language);
  const translatedLessons = await translateLessonsText(course.lessons, language);
  const firstLesson = translatedLessons[0];

  return (
    <SiteShell language={language} role={user.role}>
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-gold">{dict.courseOverview}</p>
          <h1 className="mt-4 font-display text-5xl text-white">{translatedCourse.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">{translatedCourse.description}</p>
          {firstLesson ? <Link href={`/learn/${course.slug}/${firstLesson.slug}`} className="mt-8 inline-flex rounded-full bg-gold px-6 py-3 font-medium text-black">{dict.startOrContinue}</Link> : null}
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">{dict.progress}</p>
          <p className="mt-4 font-display text-4xl text-white">{course.enrollments[0]?.progressPercent ?? 0}% complete</p>
          <p className="mt-3 text-sm text-zinc-400">{translatedLessons.length} {dict.lessonsLabel} in this course.</p>
        </div>
      </section>

      <section className="mt-10 rounded-[1.75rem] border border-white/10 bg-[#111111] p-6">
        <h2 className="font-display text-3xl text-white">{dict.lessonList}</h2>
        <div className="mt-6 space-y-4">
          {translatedLessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center justify-between rounded-[1.25rem] border border-white/10 bg-black/20 p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">{dict.lessonLabel} {lesson.order}</p>
                <h3 className="mt-2 text-xl text-white">{lesson.title}</h3>
                <p className="mt-1 text-sm text-zinc-400">{lesson.description}</p>
              </div>
              <Link href={`/learn/${course.slug}/${lesson.slug}`} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">{dict.open}</Link>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
