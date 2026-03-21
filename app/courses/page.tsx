import { CourseCard } from "@/components/course-card";
import { SiteShell } from "@/components/site-shell";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { normalizeLanguage } from "@/lib/locale";
import { translateCourseText } from "@/lib/translation";

export default async function CoursesPage() {
  const user = await requireUser();
  const language = normalizeLanguage(user.language);
  const dict = getDictionary(language);
  const courses = await prisma.course.findMany({ where: { published: true }, include: { lessons: true }, orderBy: { createdAt: "asc" } });
  const translatedCourses = await translateCourseText(courses, language);

  return (
    <SiteShell language={language} role={user.role}>
      <section>
        <p className="text-sm uppercase tracking-[0.35em] text-gold">{dict.courseLibrary}</p>
        <h1 className="mt-4 font-display text-5xl text-white">{dict.courseLibraryTitle}</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {translatedCourses.map((course) => (
            <CourseCard key={course.id} slug={course.slug} title={course.title} description={course.description} thumbnail={course.thumbnail} lessons={course.lessons.length} lessonsLabel={dict.lessonsLabel} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
