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
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-gold sm:text-sm">{dict.courseOverview}</p>
          <h1 className="mt-3 font-display text-4xl text-white sm:mt-4 sm:text-5xl">{translatedCourse.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 sm:mt-5 sm:text-lg sm:leading-8">{translatedCourse.description}</p>
          {firstLesson ? <Link href={`/learn/${course.slug}/${firstLesson.slug}`} className="button-primary mt-6 sm:mt-8">{dict.startOrContinue}</Link> : null}
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 sm:rounded-[1.75rem] sm:p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 sm:text-sm">{dict.progress}</p>
          <p className="mt-3 font-display text-3xl text-white sm:mt-4 sm:text-4xl">{course.enrollments[0]?.progressPercent ?? 0}% complete</p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">{translatedLessons.length} {dict.lessonsLabel} in this course.</p>
        </div>
      </section>

      <section className="mt-8 rounded-[1.5rem] border border-white/10 bg-[#111111] p-5 sm:mt-10 sm:rounded-[1.75rem] sm:p-6">
        <h2 className="font-display text-2xl text-white sm:text-3xl">{dict.lessonList}</h2>
        <div className="mt-5 space-y-4 sm:mt-6">
          {translatedLessons.map((lesson) => (
            <div key={lesson.id} className="flex flex-col gap-4 rounded-[1.1rem] border border-white/10 bg-black/20 p-4 sm:rounded-[1.25rem] sm:p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">{dict.lessonLabel} {lesson.order}</p>
                <h3 className="mt-2 text-lg text-white sm:text-xl">{lesson.title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-400">{lesson.description}</p>
              </div>
              <Link href={`/learn/${course.slug}/${lesson.slug}`} className="button-secondary px-4 py-2 text-sm md:min-w-[110px]">{dict.open}</Link>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
