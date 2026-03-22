import Image from "next/image";
import Link from "next/link";

type CurrentFocusCardProps = {
  eyebrow: string;
  courseLabel: string;
  courseProgressLabel: string;
  currentFocusLabel?: string;
  courseTitle: string;
  courseThumbnail: string;
  focusText?: string;
  progressPercent: number;
  actionHref: string;
  actionLabel: string;
};

export function CurrentFocusCard(props: CurrentFocusCardProps) {
  const showFocus = Boolean(props.currentFocusLabel && props.focusText);

  return (
    <div className="surface-card p-5 sm:p-6">
      <p className="text-xs uppercase tracking-[0.32em] text-gold">{props.eyebrow}</p>
      <div className="mt-5 overflow-hidden rounded-[0.9rem] border border-white/10 bg-[rgba(20,20,20,0.78)]">
        <div className="relative h-40 w-full">
          <Image src={props.courseThumbnail} alt={props.courseTitle} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        <div className="space-y-4 p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{props.courseLabel}</p>
            <p className="mt-2 text-xl text-white">{props.courseTitle}</p>
          </div>
          {showFocus ? (
            <div className="surface-card-muted p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{props.currentFocusLabel}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-200">{props.focusText}</p>
            </div>
          ) : null}
          <div>
            <div className="flex items-center justify-between text-sm text-zinc-400">
              <span>{props.courseProgressLabel}</span>
              <span>{props.progressPercent}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-gold" style={{ width: `${props.progressPercent}%` }} />
            </div>
          </div>
          <Link href={props.actionHref} className="button-primary w-full px-5 text-center sm:w-auto">
            {props.actionLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
