import Image from "next/image";
import Link from "next/link";

type ContinueLearningCardProps = {
  title: string;
  viewAllLabel: string;
  viewAllHref: string;
  courseTitle: string;
  courseDescription: string;
  courseThumbnail: string;
  progressPercent: number;
  currentLessonTitle: string;
  currentLessonLabel: string;
  ctaLabel: string;
  ctaHref: string;
};

export function ContinueLearningCard(props: ContinueLearningCardProps) {
  return (
    <div className="surface-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-white sm:text-3xl">{props.title}</h2>
        <Link href={props.viewAllHref} className="text-sm text-gold">{props.viewAllLabel}</Link>
      </div>
      <div className="surface-card-soft mt-5 overflow-hidden">
        <div className="grid md:grid-cols-[220px_1fr]">
          <div className="relative min-h-48 md:min-h-full">
            <Image src={props.courseThumbnail} alt={props.courseTitle} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.26em] text-gold">{props.currentLessonLabel}</p>
            <h3 className="mt-3 font-display text-2xl text-white">{props.courseTitle}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{props.courseDescription}</p>
            <div className="surface-card-muted mt-5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{props.currentLessonLabel}</p>
              <p className="mt-2 text-lg text-white">{props.currentLessonTitle}</p>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm text-zinc-400">
                <span>Progress</span>
                <span>{props.progressPercent}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-gold" style={{ width: `${props.progressPercent}%` }} />
              </div>
            </div>
            <Link href={props.ctaHref} className="button-primary mt-6">
              {props.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
