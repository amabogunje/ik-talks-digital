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
  const latestFeedback = data.latestFeedback;
  const focusHref = data.currentFocus?.href ?? "/courses";

  return (
    <SiteShell language={user.language} role={user.role}>
      <div className="space-y-8 sm:space-y-10">
        <DashboardHero
          headline={copy.headline}
          support={copy.support}
          primaryHref={focusHref}
          primaryLabel={copy.continueLesson}
          secondaryHref="/practice"
          secondaryLabel={copy.startPractice}
          focusCard={
            <CurrentFocusCard
              eyebrow={copy.currentFocus}
              activeCourseLabel={copy.activeCourse}
              currentFocusLabel={copy.currentFocus}
              courseProgressLabel={copy.courseProgress}
              courseTitle={data.currentFocus?.courseTitle ?? copy.noActiveCourse}
              courseThumbnail={data.currentFocus?.courseThumbnail ?? "/ak-hero.png.png"}
              focusText={data.currentFocus?.focusText ?? copy.beginLearningPath}
              progressPercent={data.currentFocus?.progressPercent ?? 0}
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
              scenarioTitle={latestFeedback?.practiceSession.scenario.title}
              contextLabel={copy.fromLastPractice}
              confidenceLabel={copy.confidenceTrend}
              confidenceValue={latestFeedback ? `${latestFeedback.confidence}%` : null}
              clarityLabel={copy.clarityTrend}
              clarityValue={latestFeedback ? `${latestFeedback.clarity}%` : null}
              summary={latestFeedback?.summary}
              topTipLabel={copy.topTipToImproveNext}
              topTip={data.latestTip ?? copy.firstPracticeNudge}
              feedbackHref={latestFeedback ? `/practice/${latestFeedback.practiceSession.scenario.slug}/feedback?session=${latestFeedback.practiceSessionId}` : undefined}
              feedbackLabel={copy.viewFullFeedback}
              practiceHref={latestFeedback ? `/practice/${latestFeedback.practiceSession.scenario.slug}` : "/practice"}
              practiceLabel={copy.practiceAgain}
              emptyTitle={copy.noCoachingYet}
              emptyBody={copy.firstPracticeNudge}
              emptyPreview={copy.firstPracticePreview}
            />
          </section>
        </section>
      </div>
    </SiteShell>
  );
}
