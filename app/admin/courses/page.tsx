import { AdminForm } from "@/components/admin-form";
import { requireAdmin } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { getAdminContext, levelLabels, skillAreaLabels } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { translateCourseText } from "@/lib/translation";

export default async function AdminCoursesPage() {
  const user = await requireAdmin();
  const dict = getDictionary(user.language);
  const { language, copy } = await getAdminContext(user.language);

  const courses = await prisma.course.findMany({ include: { lessons: true }, orderBy: [{ featured: "desc" }, { createdAt: "desc" }] });
  const translatedCourses = await translateCourseText(courses, language);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="section-title">{copy.coursesNav}</h2>
        <p className="max-w-3xl text-sm leading-7 text-zinc-400">{copy.coursesIntro}</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)] xl:items-start">
        <AdminForm
          action="/api/admin/courses"
          title={dict.createCourse}
          fields={[
            { name: "title", label: dict.title },
            { name: "slug", label: dict.slug },
            { name: "description", label: dict.description, type: "textarea" },
            { name: "thumbnail", label: dict.thumbnailUrl },
            {
              name: "skillArea",
              label: copy.skillArea,
              type: "select",
              options: [
                { value: "PUBLIC_SPEAKING", label: copy.publicSpeaking },
                { value: "HOSTING", label: copy.hosting },
                { value: "COMMUNICATION", label: copy.communication }
              ]
            },
            {
              name: "level",
              label: copy.level,
              type: "select",
              options: [
                { value: "BEGINNER", label: copy.beginner },
                { value: "ADVANCED", label: copy.advanced }
              ]
            },
            { name: "featured", label: copy.featured, type: "checkbox", required: false },
            { name: "published", label: copy.published, type: "checkbox", required: false }
          ]}
          text={{ save: dict.save, savedSuccessfully: dict.savedSuccessfully, unableToSave: dict.unableToSave }}
        />

        <div className="surface-card p-5 sm:p-6">
          <h3 className="font-display text-2xl text-white">{dict.courses}</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {translatedCourses.map((course) => (
              <div key={course.id} className="rounded-[1rem] border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg text-white">{course.title}</p>
                  {course.featured ? <span className="rounded-[0.55rem] border border-gold/20 bg-gold/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-gold">{copy.featuredBadge}</span> : null}
                </div>
                <p className="mt-1 text-sm text-zinc-400">{course.lessons.length} {dict.lessonsLabel}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">{skillAreaLabels[language][course.skillArea]} - {levelLabels[language][course.level]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
