import { CourseCard } from "@/components/course-card";
import { CurrentFocusCard } from "@/components/current-focus-card";
import { DashboardHero } from "@/components/dashboard-hero";
import { DashboardRecommendsCard } from "@/components/dashboard-recommends-card";
import { LatestCoachingCard } from "@/components/latest-coaching-card";
import { SiteShell } from "@/components/site-shell";
import { requireUser } from "@/lib/auth";
import { getDashboardCopy } from "@/lib/dashboard-copy";
import { getDashboardData } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { normalizeLanguage } from "@/lib/locale";

export default async function DashboardPage() {
  const user = await requireUser();
  const language = normalizeLanguage(user.language);
  const copy = getDashboardCopy(language);
  const dict = getDictionary(user.language);
  const data = await getDashboardData(user.id, user.language);
  const focusHref = data.currentFocus?.href ?? "/courses";
  const isRecommendedFocus = data.currentFocus?.kind === "recommended";

  return (
    <SiteShell language={user.language} role={user.role}>
      <div className="space-y-8 sm:space-y-10">
        <DashboardHero
          headline={isRecommendedFocus ? copy.recommendedHeadline : copy.headline}
          support={isRecommendedFocus ? copy.recommendedSupport : copy.support}
          focusCard={
            <CurrentFocusCard
              eyebrow={isRecommendedFocus ? copy.recommendedForYou : copy.currentFocus}
              courseLabel={isRecommendedFocus ? copy.recommendedCourse : copy.activeCourse}
              currentFocusLabel={isRecommendedFocus ? undefined : copy.currentFocus}
              courseProgressLabel={copy.courseProgress}
              courseTitle={data.currentFocus?.courseTitle ?? copy.noActiveCourse}
              courseThumbnail={data.currentFocus?.courseThumbnail ?? "/ak-hero.png.png"}
              focusText={isRecommendedFocus ? undefined : data.currentFocus?.focusText ?? copy.beginLearningPath}
              progressPercent={data.currentFocus?.progressPercent ?? 0}
              actionHref={focusHref}
              actionLabel={isRecommendedFocus ? copy.startRecommendedCourse : copy.continueLesson}
            />
          }
        />

        <section className="grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-start">
          <section className="order-2 space-y-4 lg:order-1">
            <div className="flex items-center gap-4">
              <h2 className="section-title">{copy.exploreCourses}</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-gold/35 via-white/10 to-transparent" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.courses.slice(0, 4).map((course) => (
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

          <section className="order-1 space-y-4 lg:order-2">
            <DashboardRecommendsCard
              eyebrow={copy.recommendsEyebrow}
              subtitle={copy.recommendsSubtitle}
              ctaLabel={copy.recommendsCta}
              href="/recommends"
            />

            <LatestCoachingCard
              title={copy.latestCoachingReview}
              practiceHref="/practice"
              practiceLabel={copy.practiceAgain}
              body={copy.firstPracticeNudge}
              preview={copy.firstPracticePreview}
            />
          </section>
        </section>
      </div>
    </SiteShell>
  );
}