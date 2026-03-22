import Image from "next/image";
import Link from "next/link";

type CourseLibraryCardProps = {
  title: string;
  description: string;
  thumbnail: string;
  statusLabel: string;
  statusTone: "neutral" | "progress" | "complete";
  progressPercent: number;
  progressLabel: string;
  lessonCountLabel: string;
  durationLabel: string;
  nextLessonLabel?: string;
  skillAreaLabel?: string;
  levelLabel?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

const toneClasses = {
  neutral: "border-white/10 bg-white/5 text-zinc-200",
  progress: "border-gold/20 bg-gold/10 text-gold",
  complete: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
} as const;

export function CourseLibraryCard({
  title,
  description,
  thumbnail,
  statusLabel,
  statusTone,
  progressPercent,
  progressLabel,
  lessonCountLabel,
  durationLabel,
  nextLessonLabel,
  skillAreaLabel,
  levelLabel,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: CourseLibraryCardProps) {
  return (
    <article className="overflow-hidden rounded-[0.9rem] border border-white/10 bg-[rgba(30,30,30,0.88)] shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
      <div className="relative h-44 sm:h-48">
        <Image src={thumbnail} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
        <div className={`absolute left-4 top-4 rounded-[0.6rem] border px-3 py-1 text-[11px] uppercase tracking-[0.22em] backdrop-blur-sm sm:text-xs ${toneClasses[statusTone]}`}>
          {statusLabel}
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="space-y-2">
          {(skillAreaLabel || levelLabel) ? (
            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
              {skillAreaLabel ? <span className="rounded-[0.55rem] border border-white/10 bg-white/5 px-2 py-1">{skillAreaLabel}</span> : null}
              {levelLabel ? <span className="rounded-[0.55rem] border border-white/10 bg-white/5 px-2 py-1">{levelLabel}</span> : null}
            </div>
          ) : null}
          <h3 className="font-display text-[1.3rem] leading-tight text-white sm:text-[1.55rem]">{title}</h3>
          <p className="line-clamp-3 text-sm leading-6 text-zinc-400">{description}</p>
        </div>

        <div className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
          <div className="rounded-[0.8rem] border border-white/10 bg-black/20 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{progressLabel}</p>
            <p className="mt-1 font-display text-2xl text-white">{progressPercent}%</p>
          </div>
          <div className="rounded-[0.8rem] border border-white/10 bg-black/20 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{lessonCountLabel}</p>
            <p className="mt-1 text-white">{durationLabel}</p>
          </div>
        </div>

        <div className="rounded-[0.8rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200">
          {nextLessonLabel}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href={primaryHref} className="button-primary w-full justify-center px-5 text-center sm:w-auto">
            {primaryLabel}
          </Link>
          <Link href={secondaryHref} className="button-secondary w-full justify-center px-5 text-center sm:w-auto">
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}