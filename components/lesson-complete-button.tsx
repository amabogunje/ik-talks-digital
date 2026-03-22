"use client";

import { useState } from "react";

type Props = {
  lessonId: string;
  text: {
    saving: string;
    markLessonComplete: string;
  };
};

export function LessonCompleteButton({ lessonId, text }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await fetch("/api/lessons/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId })
    });
    setLoading(false);
    window.location.reload();
  }

  return (
    <button onClick={handleClick} disabled={loading} className="button-primary px-5 disabled:opacity-50">
      {loading ? text.saving : text.markLessonComplete}
    </button>
  );
}
