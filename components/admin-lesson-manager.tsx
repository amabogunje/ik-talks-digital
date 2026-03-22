"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Lesson = {
  id: string;
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  durationMin: number;
  order: number;
};

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  published: boolean;
  featured: boolean;
  lessons: Lesson[];
};

type Copy = {
  lessonManager: string;
  lessonManagerIntro: string;
  chooseLesson: string;
  createNewLesson: string;
  lessonTitle: string;
  lessonSlug: string;
  lessonDescription: string;
  videoUrl: string;
  durationMinutes: string;
  lessonOrder: string;
  createLesson: string;
  updateLesson: string;
  deleteLesson: string;
  lessonSaved: string;
  lessonDeleted: string;
  lessonSaveFailed: string;
  lessonDeleteFailed: string;
  noLessonsYet: string;
  lessonListTitle: string;
  lessonListIntro: string;
  lessonsCount: string;
  totalDuration: string;
  openCourse: string;
  manageLessons: string;
  backToCourseManager: string;
};

type Props = {
  copy: Copy;
  course: Course;
};

type LessonForm = {
  id?: string;
  courseId: string;
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  durationMin: string;
  order: string;
};

function sortLessons(lessons: Lesson[]) {
  return [...lessons].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

function lessonToForm(courseId: string, lesson: Lesson | null, lessonCount: number): LessonForm {
  if (!lesson) {
    return {
      courseId,
      title: "",
      slug: "",
      description: "",
      videoUrl: "",
      durationMin: "5",
      order: String(lessonCount + 1)
    };
  }

  return {
    id: lesson.id,
    courseId,
    title: lesson.title,
    slug: lesson.slug,
    description: lesson.description,
    videoUrl: lesson.videoUrl,
    durationMin: String(lesson.durationMin),
    order: String(lesson.order)
  };
}

export function AdminLessonManager({ copy, course }: Props) {
  const [lessons, setLessons] = useState(() => sortLessons(course.lessons));
  const [selectedLessonId, setSelectedLessonId] = useState<string>(course.lessons[0]?.id ?? "new");
  const [lessonForm, setLessonForm] = useState<LessonForm>(() => lessonToForm(course.id, course.lessons[0] ?? null, course.lessons.length));
  const [lessonStatus, setLessonStatus] = useState("");
  const [lessonBusy, setLessonBusy] = useState(false);

  useEffect(() => {
    const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? null;
    setLessonForm(lessonToForm(course.id, selectedLesson, lessons.length));
    setLessonStatus("");
  }, [selectedLessonId, lessons, course.id]);

  async function handleLessonSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLessonBusy(true);
    setLessonStatus("");

    const response = await fetch("/api/admin/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lessonForm, courseId: course.id })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setLessonStatus(data.error ?? copy.lessonSaveFailed);
      setLessonBusy(false);
      return;
    }

    const savedLesson = data.lesson as Lesson;
    const nextLessons = lessons.some((lesson) => lesson.id === savedLesson.id)
      ? lessons.map((lesson) => (lesson.id === savedLesson.id ? savedLesson : lesson))
      : [...lessons, savedLesson];

    const ordered = sortLessons(nextLessons);
    setLessons(ordered);
    setSelectedLessonId(savedLesson.id);
    setLessonForm(lessonToForm(course.id, savedLesson, ordered.length));
    setLessonStatus(copy.lessonSaved);
    setLessonBusy(false);
  }

  async function handleLessonDelete() {
    if (!lessonForm.id) return;
    setLessonBusy(true);
    setLessonStatus("");

    const response = await fetch("/api/admin/lessons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lessonForm.id })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setLessonStatus(data.error ?? copy.lessonDeleteFailed);
      setLessonBusy(false);
      return;
    }

    const remaining = lessons.filter((lesson) => lesson.id !== lessonForm.id);
    setLessons(remaining);
    const nextLesson = remaining[0] ?? null;
    setSelectedLessonId(nextLesson?.id ?? "new");
    setLessonForm(lessonToForm(course.id, nextLesson, remaining.length));
    setLessonStatus(copy.lessonDeleted);
    setLessonBusy(false);
  }

  const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.durationMin, 0);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/courses" className="button-secondary px-4 py-2 text-sm">{copy.backToCourseManager}</Link>
          <Link href={`/courses/${course.slug}`} className="text-sm text-gold hover:text-yellow-200">{copy.openCourse}</Link>
        </div>
        <h2 className="section-title">{copy.lessonManager}</h2>
        <p className="max-w-3xl text-sm leading-7 text-zinc-400">{copy.lessonManagerIntro}</p>
      </section>

      <div className="surface-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">{copy.manageLessons}</p>
            <h3 className="mt-2 font-display text-3xl text-white">{course.title}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-400">{course.description}</p>
          </div>
          <div className="rounded-[0.9rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300">
            <p>{copy.lessonsCount}: {lessons.length}</p>
            <p className="mt-1 text-zinc-400">{copy.totalDuration}: {totalDuration} min</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_300px] xl:items-start">
        <section className="surface-card p-5 sm:p-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">{copy.chooseLesson}</p>
            <select value={selectedLessonId} onChange={(event) => setSelectedLessonId(event.target.value)} className="surface-input">
              <option value="new">{copy.createNewLesson}</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>{lesson.order}. {lesson.title}</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleLessonSubmit} className="mt-5 space-y-4">
            <div className="space-y-2">
              <span className="text-sm text-zinc-300">{copy.lessonTitle}</span>
              <input value={lessonForm.title} onChange={(event) => setLessonForm((current) => ({ ...current, title: event.target.value }))} className="surface-input" required />
            </div>
            <div className="space-y-2">
              <span className="text-sm text-zinc-300">{copy.lessonSlug}</span>
              <input value={lessonForm.slug} onChange={(event) => setLessonForm((current) => ({ ...current, slug: event.target.value }))} className="surface-input" required />
            </div>
            <div className="space-y-2">
              <span className="text-sm text-zinc-300">{copy.lessonDescription}</span>
              <textarea value={lessonForm.description} onChange={(event) => setLessonForm((current) => ({ ...current, description: event.target.value }))} className="surface-input min-h-28 resize-y" required />
            </div>
            <div className="space-y-2">
              <span className="text-sm text-zinc-300">{copy.videoUrl}</span>
              <input value={lessonForm.videoUrl} onChange={(event) => setLessonForm((current) => ({ ...current, videoUrl: event.target.value }))} className="surface-input" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">{copy.durationMinutes}</span>
                <input type="number" min="1" value={lessonForm.durationMin} onChange={(event) => setLessonForm((current) => ({ ...current, durationMin: event.target.value }))} className="surface-input" required />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">{copy.lessonOrder}</span>
                <input type="number" min="1" value={lessonForm.order} onChange={(event) => setLessonForm((current) => ({ ...current, order: event.target.value }))} className="surface-input" required />
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="button-primary px-5" disabled={lessonBusy}>{lessonForm.id ? copy.updateLesson : copy.createLesson}</button>
              <button type="button" className="button-secondary px-5" onClick={() => { setSelectedLessonId("new"); setLessonForm(lessonToForm(course.id, null, lessons.length)); }}>{copy.createNewLesson}</button>
              {lessonForm.id ? <button type="button" className="button-secondary px-5 text-red-200 hover:border-red-300/40 hover:text-red-100" onClick={handleLessonDelete} disabled={lessonBusy}>{copy.deleteLesson}</button> : null}
            </div>

            {lessonStatus ? <p className="text-sm text-zinc-400">{lessonStatus}</p> : null}
          </form>
        </section>

        <section className="rounded-[1rem] border border-white/10 bg-black/20 p-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.25em] text-gold">{copy.lessonListTitle}</p>
            <p className="text-sm leading-6 text-zinc-400">{copy.lessonListIntro}</p>
          </div>

          <div className="mt-4 space-y-3">
            {lessons.length ? lessons.map((lesson) => (
              <button key={lesson.id} type="button" onClick={() => setSelectedLessonId(lesson.id)} className={`w-full rounded-[0.85rem] border px-3 py-3 text-left transition ${selectedLessonId === lesson.id ? "border-gold/30 bg-gold/10" : "border-white/10 bg-black/10 hover:border-white/20"}`}>
                <p className="text-sm text-white">{lesson.order}. {lesson.title}</p>
                <p className="mt-1 text-xs text-zinc-400">{lesson.durationMin} min</p>
              </button>
            )) : <p className="text-sm leading-6 text-zinc-400">{copy.noLessonsYet}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
