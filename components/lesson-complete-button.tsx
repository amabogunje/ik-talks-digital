"use client";

import { useTransition } from "react";

type Props = {
  lessonId: string;
  text: {
    saving: string;
    markLessonComplete: string;
  };
};

export function LessonCompleteButton({ lessonId, text }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await fetch(`/api/lessons/${lessonId}/complete`, { method: "POST" });
          window.location.reload();
        })
      }
      className="rounded-full bg-gold px-5 py-3 font-medium text-black disabled:opacity-50"
    >
      {isPending ? text.saving : text.markLessonComplete}
    </button>
  );
}
