"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Lesson = {
  id: string;
  durationMin: number;
};

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  published: boolean;
  featured: boolean;
  skillArea: string;
  level: string;
  lessons: Lesson[];
};

type Copy = {
  courseWorkspaceTitle: string;
  courseWorkspaceIntro: string;
  chooseCourse: string;
  createNewCourse: string;
  courseTitle: string;
  courseSlug: string;
  courseDescription: string;
  thumbnail: string;
  skillArea: string;
  level: string;
  featured: string;
  published: string;
  publicSpeaking: string;
  hosting: string;
  communication: string;
  beginner: string;
  advanced: string;
  createCourse: string;
  updateCourse: string;
  deleteCourse: string;
  resetForm: string;
  courseSaved: string;
  courseDeleted: string;
  courseSaveFailed: string;
  courseDeleteFailed: string;
  existingCourses: string;
  existingCoursesIntro: string;
  lessonsCount: string;
  totalDuration: string;
  openCourse: string;
  featuredBadge: string;
  draft: string;
  manageLessons: string;
};

type Props = {
  copy: Copy;
  courses: Course[];
};

type CourseForm = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  skillArea: string;
  level: string;
  featured: boolean;
  published: boolean;
};

function emptyCourse(): CourseForm {
  return {
    title: "",
    slug: "",
    description: "",
    thumbnail: "",
    skillArea: "PUBLIC_SPEAKING",
    level: "BEGINNER",
    featured: false,
    published: true
  };
}

function courseToForm(course: Course | null): CourseForm {
  if (!course) return emptyCourse();
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    thumbnail: course.thumbnail,
    skillArea: course.skillArea,
    level: course.level,
    featured: course.featured,
    published: course.published
  };
}

function upsertCourse(courses: Course[], nextCourse: Course) {
  const next = courses.some((course) => course.id === nextCourse.id)
    ? courses.map((course) => (course.id === nextCourse.id ? nextCourse : course))
    : [nextCourse, ...courses];

  return next.sort((a, b) => a.title.localeCompare(b.title));
}

export function AdminCourseManager({ copy, courses: initialCourses }: Props) {
  const [courses, setCourses] = useState(initialCourses);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourses[0]?.id ?? "new");
  const selectedCourse = courses.find((course) => course.id === selectedCourseId) ?? null;
  const [courseForm, setCourseForm] = useState<CourseForm>(() => courseToForm(selectedCourse));
  const [courseStatus, setCourseStatus] = useState("");
  const [courseBusy, setCourseBusy] = useState(false);

  useEffect(() => {
    setCourseForm(courseToForm(selectedCourse));
    setCourseStatus("");
  }, [selectedCourseId]);

  async function handleCourseSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCourseBusy(true);
    setCourseStatus("");

    const response = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseForm)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setCourseStatus(data.error ?? copy.courseSaveFailed);
      setCourseBusy(false);
      return;
    }

    const nextCourse = data.course as Course;
    setCourses((current) => upsertCourse(current, nextCourse));
    setSelectedCourseId(nextCourse.id);
    setCourseForm(courseToForm(nextCourse));
    setCourseStatus(copy.courseSaved);
    setCourseBusy(false);
  }

  async function handleCourseDelete() {
    if (!selectedCourse) return;
    setCourseBusy(true);
    setCourseStatus("");

    const response = await fetch("/api/admin/courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedCourse.id })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setCourseStatus(data.error ?? copy.courseDeleteFailed);
      setCourseBusy(false);
      return;
    }

    const remaining = courses.filter((course) => course.id !== selectedCourse.id);
    setCourses(remaining);
    setSelectedCourseId(remaining[0]?.id ?? "new");
    setCourseForm(emptyCourse());
    setCourseStatus(copy.courseDeleted);
    setCourseBusy(false);
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="section-title">{copy.courseWorkspaceTitle}</h2>
        <p className="max-w-3xl text-sm leading-7 text-zinc-400">{copy.courseWorkspaceIntro}</p>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{copy.chooseCourse}</p>
          <select value={selectedCourseId} onChange={(event) => setSelectedCourseId(event.target.value)} className="surface-input">
            <option value="new">{copy.createNewCourse}</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleCourseSubmit} className="mt-5 space-y-4">
          <div className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.courseTitle}</span>
            <input value={courseForm.title} onChange={(event) => setCourseForm((current) => ({ ...current, title: event.target.value }))} className="surface-input" required />
          </div>
          <div className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.courseSlug}</span>
            <input value={courseForm.slug} onChange={(event) => setCourseForm((current) => ({ ...current, slug: event.target.value }))} className="surface-input" required />
          </div>
          <div className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.courseDescription}</span>
            <textarea value={courseForm.description} onChange={(event) => setCourseForm((current) => ({ ...current, description: event.target.value }))} className="surface-input min-h-28 resize-y" required />
          </div>
          <div className="space-y-2">
            <span className="text-sm text-zinc-300">{copy.thumbnail}</span>
            <input value={courseForm.thumbnail} onChange={(event) => setCourseForm((current) => ({ ...current, thumbnail: event.target.value }))} className="surface-input" required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-zinc-300">{copy.skillArea}</span>
              <select value={courseForm.skillArea} onChange={(event) => setCourseForm((current) => ({ ...current, skillArea: event.target.value }))} className="surface-input">
                <option value="PUBLIC_SPEAKING">{copy.publicSpeaking}</option>
                <option value="HOSTING">{copy.hosting}</option>
                <option value="COMMUNICATION">{copy.communication}</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm text-zinc-300">{copy.level}</span>
              <select value={courseForm.level} onChange={(event) => setCourseForm((current) => ({ ...current, level: event.target.value }))} className="surface-input">
                <option value="BEGINNER">{copy.beginner}</option>
                <option value="ADVANCED">{copy.advanced}</option>
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-[0.8rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200">
              <input type="checkbox" checked={courseForm.featured} onChange={(event) => setCourseForm((current) => ({ ...current, featured: event.target.checked }))} className="h-4 w-4 accent-yellow-400" />
              <span>{copy.featured}</span>
            </label>
            <label className="flex items-center gap-3 rounded-[0.8rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200">
              <input type="checkbox" checked={courseForm.published} onChange={(event) => setCourseForm((current) => ({ ...current, published: event.target.checked }))} className="h-4 w-4 accent-yellow-400" />
              <span>{copy.published}</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="button-primary px-5" disabled={courseBusy}>{courseForm.id ? copy.updateCourse : copy.createCourse}</button>
            <button type="button" className="button-secondary px-5" onClick={() => { setSelectedCourseId("new"); setCourseForm(emptyCourse()); }}>{copy.resetForm}</button>
            {courseForm.id ? <button type="button" className="button-secondary px-5 text-red-200 hover:border-red-300/40 hover:text-red-100" onClick={handleCourseDelete} disabled={courseBusy}>{copy.deleteCourse}</button> : null}
            {courseForm.id ? <Link href={`/admin/courses/${courseForm.id}`} className="button-secondary px-5">{copy.manageLessons}</Link> : null}
          </div>

          {courseStatus ? <p className="text-sm text-zinc-400">{courseStatus}</p> : null}
        </form>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <div className="space-y-2">
          <h3 className="font-display text-2xl text-white">{copy.existingCourses}</h3>
          <p className="text-sm leading-6 text-zinc-400">{copy.existingCoursesIntro}</p>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {courses.map((course) => (
            <div key={course.id} className={`rounded-[0.9rem] border px-4 py-4 transition ${selectedCourseId === course.id ? "border-gold/30 bg-gold/10" : "border-white/10 bg-black/20"}`}>
              <div className="flex items-start justify-between gap-3">
                <button type="button" onClick={() => setSelectedCourseId(course.id)} className="min-w-0 flex-1 text-left">
                  <p className="text-base text-white">{course.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">{course.slug}</p>
                </button>
                <div className="flex flex-wrap justify-end gap-2 text-[11px] uppercase tracking-[0.18em]">
                  {course.featured ? <span className="rounded-[0.55rem] border border-gold/20 bg-gold/10 px-2 py-1 text-gold">{copy.featuredBadge}</span> : null}
                  <span className="rounded-[0.55rem] border border-white/10 px-2 py-1 text-zinc-400">{course.published ? copy.published : copy.draft}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-400">
                <span>{copy.lessonsCount}: {course.lessons.length}</span>
                <span>{copy.totalDuration}: {course.lessons.reduce((sum, lesson) => sum + lesson.durationMin, 0)} min</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`/admin/courses/${course.id}`} className="button-secondary px-4 py-2 text-sm">{copy.manageLessons}</Link>
                <Link href={`/courses/${course.slug}`} className="self-center text-sm text-gold hover:text-yellow-200">{copy.openCourse}</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
