"use client";

import { CourseLibraryCard } from "@/components/course-library-card";

type BrowserCourse = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  featured: boolean;
  skillArea: string;
  skillAreaLabel: string;
  levelLabel: string;
  statusLabel: string;
  statusTone: "neutral" | "progress" | "complete";
  progressPercent: number;
  progressLabel: string;
  lessonCountLabel: string;
  durationLabel: string;
  nextLessonLabel: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

type Copy = {
  eyebrow: string;
  title: string;
  intro: string;
  myCourses: string;
  myCoursesIntro: string;
  exploreCourses: string;
  exploreCoursesIntro: string;
  completedCourses: string;
  completedCoursesIntro: string;
  noCurrentCourses: string;
};

type Props = {
  copy: Copy;
  myCourses: BrowserCourse[];
  availableCourses: BrowserCourse[];
  completedCourses: BrowserCourse[];
};

function SectionHeader({ title, intro }: { title: string; intro: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <h2 className="section-title">{title}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-gold/35 via-white/10 to-transparent" />
      </div>
      <p className="max-w-3xl text-sm leading-6 text-zinc-400">{intro}</p>
    </div>
  );
}

export function CourseLibraryBrowser({ copy, myCourses, availableCourses, completedCourses }: Props) {
  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-gold sm:text-sm">{copy.eyebrow}</p>
        {copy.title ? <h1 className="font-display text-4xl text-white sm:text-5xl">{copy.title}</h1> : null}
        <p className="max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">{copy.intro}</p>
      </section>

      {(myCourses.length || !myCourses.length) ? (
        <section className="space-y-5">
          <SectionHeader title={copy.myCourses} intro={myCourses.length ? copy.myCoursesIntro : copy.noCurrentCourses} />
          {myCourses.length ? <div className="grid gap-4 md:grid-cols-2">{myCourses.map((course) => <CourseLibraryCard key={course.id} {...course} />)}</div> : null}
        </section>
      ) : null}

      {availableCourses.length ? (
        <section className="space-y-5">
          <SectionHeader title={copy.exploreCourses} intro={copy.exploreCoursesIntro} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {availableCourses.map((course) => <CourseLibraryCard key={course.id} {...course} />)}
          </div>
        </section>
      ) : null}

      {completedCourses.length ? (
        <section className="space-y-5">
          <SectionHeader title={copy.completedCourses} intro={copy.completedCoursesIntro} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {completedCourses.map((course) => <CourseLibraryCard key={course.id} {...course} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
