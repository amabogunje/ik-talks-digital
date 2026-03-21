"use client";

import { useState } from "react";

export function VideoPlayer({ src, title, text }: { src: string; title: string; text: { readyToPlay: string; loading: string } }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black">
      <video controls className="aspect-video w-full" onLoadedData={() => setLoaded(true)}>
        <source src={src} />
      </video>
      <div className="flex items-center justify-between px-5 py-4 text-sm text-zinc-400">
        <span>{title}</span>
        <span>{loaded ? text.readyToPlay : text.loading}</span>
      </div>
    </div>
  );
}
