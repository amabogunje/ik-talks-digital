import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { getCourseBySlug } from "@/lib/data";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { normalizeLanguage } from "@/lib/locale";
import { translateCourseText, translateLessonsText } from "@/lib/translation";

const detailCopy = {
  EN: {
    titleLabel: "Course overview",
    introLabel: "Course focus",
    progressLabel: "Course progress",
    lessonCountLabel: "Lessons",
    durationLabel: "Estimated duration",
    statusLabel: "Current status",
    nextLessonLabel: "Next lesson",
    whatYouBuild: "What you will build",
    lessonListLabel: "Lesson path",
    completed: "Completed",
    inProgress: "In progress",
    notStarted: "Not started",
    current: "Current",
    upNext: "Up next",
    review: "Review",
    continueLesson: "Continue lesson",
    startCourse: "Start course",
    viewAllCourses: "Back to courses"
  },
  FR: {
    titleLabel: "Apercu du cours",
    introLabel: "Focus du cours",
    progressLabel: "Progression du cours",
    lessonCountLabel: "Lecons",
    durationLabel: "Duree estimee",
    statusLabel: "Statut actuel",
    nextLessonLabel: "Prochaine lecon",
    whatYouBuild: "Ce que vous allez developper",
    lessonListLabel: "Parcours des lecons",
    completed: "Termine",
    inProgress: "En cours",
    notStarted: "Pas commence",
    current: "Actuelle",
    upNext: "Ensuite",
    review: "Revoir",
    continueLesson: "Continuer la lecon",
    startCourse: "Commencer le cours",
    viewAllCourses: "Retour aux cours"
  }
} as const;

function formatDuration(minutes: number, language: "EN" | "FR") {
  if (language === "FR") {
    return minutes >= 60 ? `${Math.floor(minutes / 60)} h ${minutes % 60} min` : `${minutes} min`;
  }
  return minutes >= 60 ? `${Math.floor(minutes / 60)} hr ${minutes % 60} min` : `${minutes} min`;
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await requireUser();
  const language = normalizeLanguage(user.language);
  const dict = getDictionary(language);
  const copy = detailCopy[language];
  const { slug } = await params;
  const course = await getCourseBySlug(slug, user.id);

  if (!course) notFound();

  const [translatedCourse] = await translateCourseText([course], language);
  const translatedLessons = await translateLessonsText(course.lessons, language);
  const translatedLessonsById = new Map(translatedLessons.map((lesson) => [lesson.id, lesson]));
  const statusLabel = course.status === "completed" ? copy.completed : course.status === "in_progress" ? copy.inProgress : copy.notStarted;
  const primaryLabel = course.status === "completed" ? copy.review : course.status === "in_progress" ? copy.continueLesson : copy.startCourse;

  return (
    <SiteShell language={language} role={user.role}>
      <div className="space-y-8 sm:space-y-10">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-8">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.35em] text-gold sm:text-sm">{copy.titleLabel}</p>
            <h1 className="font-display text-4xl text-white sm:text-5xl">{translatedCourse.title}</h1>
            <p className="max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">{translatedCourse.description}</p>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="surface-card-muted p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{copy.progressLabel}</p>
                <p className="mt-1 font-display text-2xl text-white">{course.progressPercent}%</p>
              </div>
              <div className="surface-card-muted p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{copy.lessonCountLabel}</p>
                <p className="mt-1 text-white">{course.lessons.length} {dict.lessonsLabel}</p>
              </div>
              <div className="surface-card-muted p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{copy.durationLabel}</p>
                <p className="mt-1 text-white">{formatDuration(course.durationMin, language)}</p>
              </div>
              <div className="surface-card-muted p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{copy.statusLabel}</p>
                <p className="mt-1 text-white">{statusLabel}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {course.currentLesson ? (
                <Link href={course.resumeHref} className="button-primary px-6">
                  {primaryLabel}
                </Link>
              ) : null}
              <Link href="/courses" className="button-secondary px-6">
                {copy.viewAllCourses}
              </Link>
            </div>
          </div>

          <div className="surface-card overflow-hidden p-0">
            <div className="relative h-64 sm:h-72 lg:h-full lg:min-h-[28rem]">
              <Image src={course.thumbnail} alt={translatedCourse.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 space-y-3 p-5 sm:p-6">
                <div className="rounded-[0.8rem] border border-gold/15 bg-gold/10 px-4 py-3 text-sm text-zinc-100">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-gold">{copy.nextLessonLabel}</p>
                  <p className="mt-1 text-base text-white">{course.currentLesson ? (translatedLessonsById.get(course.currentLesson.id)?.title ?? course.currentLesson.title) : translatedCourse.title}</p>
                </div>
                <div className="rounded-[0.8rem] border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-200">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-400">{copy.whatYouBuild}</p>
                  <p className="mt-1 leading-6">{translatedCourse.description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="section-title">{copy.lessonListLabel}</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gold/35 via-white/10 to-transparent" />
          </div>
          <div className="space-y-4">
            {course.lessons.map((lesson) => {
              const translatedLesson = translatedLessonsById.get(lesson.id) ?? lesson;
              const isCompleted = lesson.progress.some((entry) => entry.completed);
              const isCurrent = course.currentLesson?.id === lesson.id && !isCompleted;
              const lessonStatus = isCompleted ? copy.completed : isCurrent ? copy.current : copy.upNext;
              const lessonCta = isCompleted ? copy.review : isCurrent ? copy.continueLesson : dict.open;
              const lessonTone = isCompleted
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                : isCurrent
                  ? "border-gold/20 bg-gold/10 text-gold"
                  : "border-white/10 bg-white/5 text-zinc-200";

              return (
                <div key={lesson.id} className="flex flex-col gap-4 rounded-[0.95rem] border border-white/10 bg-[rgba(30,30,30,0.88)] p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-gold">{dict.lessonLabel} {lesson.order}</p>
                      <span className={`rounded-[0.55rem] border px-3 py-1 text-[11px] uppercase tracking-[0.2em] ${lessonTone}`}>
                        {lessonStatus}
                      </span>
                    </div>
                    <h3 className="text-lg text-white sm:text-xl">{translatedLesson.title}</h3>
                    <p className="text-sm leading-6 text-zinc-400">{translatedLesson.description}</p>
                  </div>
                  <Link href={`/learn/${course.slug}/${lesson.slug}`} className="button-secondary w-full px-4 py-2 text-center text-sm md:w-auto md:min-w-[132px]">
                    {lessonCta}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
