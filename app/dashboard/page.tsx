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
      <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-gold">{dict.learnerDashboard}</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight">{dict.welcome}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
            Welcome back, {user.name}. Continue your current lessons, then jump into practice and get clearer coaching from your latest delivery.
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Profile</p>
          <p className="mt-4 font-display text-3xl text-white">{user.name}</p>
          <p className="mt-2 text-sm text-zinc-400">{user.email}</p>
          <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-black/20 p-4 text-sm leading-7 text-zinc-300">
            Use the top menu to switch language, move into practice, or jump straight into script generation.
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-4">
        <MetricCard label="In progress" value={data.enrollments.length} note="Active courses on your path" />
        <MetricCard label="Lessons done" value={data.enrollments.reduce((sum, item) => sum + item.lessonsCompleted, 0)} note="Completed lesson count" />
        <MetricCard label="Practice sessions" value={data.practiceSessionsCount} note="Recorded speaking reps" />
        <MetricCard label="Latest score" value={latestFeedback ? `${latestFeedback.confidence}%` : "New"} note={latestFeedback ? latestFeedback.practiceSession.scenario.title : "Your next practice review will appear here"} />
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl text-white">{dict.continueLearning}</h2>
            <Link href="/courses" className="text-sm text-gold">View all courses</Link>
          </div>
          <div className="mt-6 space-y-4">
            {data.enrollments.map((enrollment) => (
              <div key={enrollment.id} className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/20">
                <div className="grid gap-0 md:grid-cols-[180px_1fr]">
                  <div className="relative min-h-40">
                    <Image src={enrollment.course.thumbnail} alt={enrollment.course.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 md:bg-gradient-to-t" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl text-white">{enrollment.course.title}</h3>
                        <p className="mt-2 text-sm text-zinc-400">{enrollment.course.description}</p>
                      </div>
                      <span className="rounded-full bg-gold/10 px-3 py-1 text-sm text-gold">{enrollment.computedProgress}%</span>
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

        <div className="rounded-[1.75rem] border border-white/10 bg-[#111111] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Latest practice feedback</p>
              <h2 className="mt-2 font-display text-3xl text-white">Your most recent coaching review</h2>
            </div>
            <Link href="/practice" className="text-sm text-gold">Go to practice</Link>
          </div>
          {latestFeedback ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-[1.25rem] border border-gold/15 bg-gold/10 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-gold">Scenario</p>
                <p className="mt-2 text-xl text-white">{latestFeedback.practiceSession.scenario.title}</p>
                <p className="mt-2 text-sm text-zinc-300">Recorded delivery review from your latest practice session.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MetricCard label="Confidence" value={`${latestFeedback.confidence}%`} />
                <MetricCard label="Clarity" value={`${latestFeedback.clarity}%`} />
              </div>
              <p className="rounded-[1.25rem] border border-white/10 bg-black/20 p-5 text-sm leading-7 text-zinc-300">
                {latestFeedback.summary}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={`/practice/${latestFeedback.practiceSession.scenario.slug}/feedback?session=${latestFeedback.practiceSessionId}`} className="inline-flex rounded-full bg-gold px-5 py-3 font-medium text-black">
                  View full feedback
                </Link>
                <Link href="/scripts" className="inline-flex rounded-full border border-white/10 px-5 py-3 text-white">
                  {dict.generateScript}
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-black/20 p-5 text-zinc-400">
              Start a practice scenario from the top menu to receive your first coaching review.
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
