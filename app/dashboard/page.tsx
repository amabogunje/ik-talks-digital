import Image from "next/image";
import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { SiteShell } from "@/components/site-shell";
import { getDashboardData } from "@/lib/data";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);
  const dict = getDictionary(user.language);
  const latestFeedback = data.latestFeedback;

  return (
    <SiteShell language={user.language} role={user.role}>
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:gap-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-gold sm:text-sm">{dict.learnerDashboard}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:mt-4 sm:text-5xl">{dict.welcome}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:mt-5 sm:text-lg sm:leading-8">
            Welcome back, {user.name}. Continue your current lessons, then jump into practice and get clearer coaching from your latest delivery.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 sm:rounded-[1.75rem] sm:p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 sm:text-sm">Profile</p>
          <p className="mt-3 font-display text-2xl text-white sm:mt-4 sm:text-3xl">{user.name}</p>
          <p className="mt-2 break-all text-sm text-zinc-400">{user.email}</p>
          <div className="mt-5 rounded-[1.1rem] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-300 sm:mt-6 sm:rounded-[1.25rem] sm:leading-7">
            Use the top menu to switch language, move into practice, or jump straight into script generation.
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="In progress" value={data.enrollments.length} note="Active courses on your path" />
        <MetricCard label="Lessons done" value={data.enrollments.reduce((sum, item) => sum + item.lessonsCompleted, 0)} note="Completed lesson count" />
        <MetricCard label="Practice sessions" value={data.practiceSessionsCount} note="Recorded speaking reps" />
        <MetricCard label="Latest score" value={latestFeedback ? `${latestFeedback.confidence}%` : "New"} note={latestFeedback ? latestFeedback.practiceSession.scenario.title : "Your next practice review will appear here"} />
      </section>

      <section className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 sm:rounded-[1.75rem] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl text-white sm:text-3xl">{dict.continueLearning}</h2>
            <Link href="/courses" className="text-sm text-gold">View all courses</Link>
          </div>
          <div className="mt-5 space-y-4 sm:mt-6">
            {data.enrollments.map((enrollment) => (
              <div key={enrollment.id} className="overflow-hidden rounded-[1.1rem] border border-white/10 bg-black/20 sm:rounded-[1.25rem]">
                <div className="grid gap-0 md:grid-cols-[180px_1fr]">
                  <div className="relative min-h-44 md:min-h-40">
                    <Image src={enrollment.course.thumbnail} alt={enrollment.course.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <h3 className="font-display text-xl text-white sm:text-2xl">{enrollment.course.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">{enrollment.course.description}</p>
                      </div>
                      <span className="w-fit rounded-full bg-gold/10 px-3 py-1 text-sm text-gold">{enrollment.computedProgress}%</span>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/5">
                      <div className="h-2 rounded-full bg-gold" style={{ width: `${enrollment.computedProgress}%` }} />
                    </div>
                    <Link href={`/courses/${enrollment.course.slug}`} className="mt-4 inline-flex text-sm text-gold">Open course</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-[#111111] p-5 sm:rounded-[1.75rem] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 sm:text-sm">Latest practice feedback</p>
              <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">Your most recent coaching review</h2>
            </div>
            <Link href="/practice" className="text-sm text-gold">Go to practice</Link>
          </div>
          {latestFeedback ? (
            <div className="mt-5 space-y-4 sm:mt-6">
              <div className="rounded-[1.1rem] border border-gold/15 bg-gold/10 p-4 sm:rounded-[1.25rem] sm:p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-gold">Scenario</p>
                <p className="mt-2 text-lg text-white sm:text-xl">{latestFeedback.practiceSession.scenario.title}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">Recorded delivery review from your latest practice session.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <MetricCard label="Confidence" value={`${latestFeedback.confidence}%`} />
                <MetricCard label="Clarity" value={`${latestFeedback.clarity}%`} />
              </div>
              <p className="rounded-[1.1rem] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-300 sm:rounded-[1.25rem] sm:p-5 sm:leading-7">
                {latestFeedback.summary}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href={`/practice/${latestFeedback.practiceSession.scenario.slug}/feedback?session=${latestFeedback.practiceSessionId}`} className="inline-flex justify-center rounded-full bg-gold px-5 py-3 font-medium text-black">
                  View full feedback
                </Link>
                <Link href="/scripts" className="inline-flex justify-center rounded-full border border-white/10 px-5 py-3 text-white">
                  {dict.generateScript}
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.1rem] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-400 sm:mt-6 sm:rounded-[1.25rem] sm:p-5">
              Start a practice scenario from the top menu to receive your first coaching review.
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
