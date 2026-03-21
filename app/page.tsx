import { Hero } from "@/components/hero";
import { PublicHeader } from "@/components/public-header";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course-card";
import { getDictionary } from "@/lib/i18n";
import { getPreferredLanguage } from "@/lib/locale";
import { translateCourseText } from "@/lib/translation";

export default async function HomePage() {
  const language = await getPreferredLanguage();
  const dict = getDictionary(language);

  const courses = await prisma.course.findMany({
    where: { published: true },
    include: { lessons: true },
    orderBy: { createdAt: "asc" },
    take: 3
  });

  const translatedCourses = await translateCourseText(courses, language);

  return (
    <div className="min-h-screen bg-aura px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-10">
        <PublicHeader language={language} dict={dict} />

        <Hero dict={dict} />

        <section className="space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-gold md:text-base">{dict.featuredCourses}</p>
          <div className="grid gap-6 md:grid-cols-3">
            {translatedCourses.map((course) => (
              <CourseCard
                key={course.id}
                slug={course.slug}
                title={course.title}
                description={course.description}
                thumbnail={course.thumbnail}
                lessons={course.lessons.length}
                lessonsLabel={dict.lessonsLabel}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
