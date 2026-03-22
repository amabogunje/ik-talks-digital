"use client";

import { useMemo, useState } from "react";
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
  searchLabel: string;
  searchPlaceholder: string;
  filterLabel: string;
  allSkills: string;
  noMatches: string;
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
  skillFilters: Array<{ value: string; label: string }>;
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

function filterCourses(courses: BrowserCourse[], search: string, skill: string) {
  const query = search.trim().toLowerCase();
  return courses.filter((course) => {
    const matchesSkill = skill === "ALL" || course.skillArea === skill;
    const matchesSearch = !query || `${course.title} ${course.description} ${course.nextLessonLabel}`.toLowerCase().includes(query);
    return matchesSkill && matchesSearch;
  });
}

export function CourseLibraryBrowser({ copy, myCourses, availableCourses, completedCourses, skillFilters }: Props) {
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("ALL");

  const filteredMyCourses = useMemo(() => filterCourses(myCourses, search, skill), [myCourses, search, skill]);
  const filteredAvailable = useMemo(() => filterCourses(availableCourses, search, skill), [availableCourses, search, skill]);
  const filteredCompleted = useMemo(() => filterCourses(completedCourses, search, skill), [completedCourses, search, skill]);
  const hasResults = Boolean(filteredMyCourses.length || filteredAvailable.length || filteredCompleted.length || !myCourses.length);

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <label className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.searchLabel}</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={copy.searchPlaceholder} className="surface-input" />
          </label>
          <div className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.filterLabel}</span>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setSkill("ALL")} className={`rounded-[0.6rem] border px-3 py-2 text-sm ${skill === "ALL" ? "border-gold/30 bg-gold/10 text-gold" : "border-white/10 bg-white/5 text-zinc-300"}`}>
                {copy.allSkills}
              </button>
              {skillFilters.map((item) => (
                <button key={item.value} type="button" onClick={() => setSkill(item.value)} className={`rounded-[0.6rem] border px-3 py-2 text-sm ${skill === item.value ? "border-gold/30 bg-gold/10 text-gold" : "border-white/10 bg-white/5 text-zinc-300"}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {!hasResults ? <p className="text-sm leading-6 text-zinc-400">{copy.noMatches}</p> : null}

      {(filteredMyCourses.length || !myCourses.length) ? (
        <section className="space-y-5">
          <SectionHeader title={copy.myCourses} intro={filteredMyCourses.length ? copy.myCoursesIntro : copy.noCurrentCourses} />
          {filteredMyCourses.length ? <div className="grid gap-4 md:grid-cols-2">{filteredMyCourses.map((course) => <CourseLibraryCard key={course.id} {...course} />)}</div> : null}
        </section>
      ) : null}

      {filteredAvailable.length ? (
        <section className="space-y-5">
          <SectionHeader title={copy.exploreCourses} intro={copy.exploreCoursesIntro} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredAvailable.map((course) => <CourseLibraryCard key={course.id} {...course} />)}
          </div>
        </section>
      ) : null}

      {filteredCompleted.length ? (
        <section className="space-y-5">
          <SectionHeader title={copy.completedCourses} intro={copy.completedCoursesIntro} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCompleted.map((course) => <CourseLibraryCard key={course.id} {...course} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}