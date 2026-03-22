import { redirect } from "next/navigation";
import { Hero } from "@/components/hero";
import { PublicHeader } from "@/components/public-header";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course-card";
import { getDictionary } from "@/lib/i18n";
import { getPreferredLanguage } from "@/lib/locale";
import { translateCourseText } from "@/lib/translation";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/dashboard");
  }

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
    <div className="min-h-screen bg-aura text-white">
      <div className="border-b border-white/10 bg-black/85 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <PublicHeader language={language} dict={dict} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-5 sm:space-y-10 sm:px-6 sm:py-8 lg:space-y-12 lg:px-8">
        <Hero dict={dict} />

        <section className="rounded-[0.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-5 sm:p-6 lg:p-8">
          <div className="flex items-center gap-4">
            <p className="section-title text-xl sm:text-2xl">{dict.featuredCourses}</p>
            <div className="h-px flex-1 bg-gradient-to-r from-gold/35 via-white/10 to-transparent" />
          </div>
          <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
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
