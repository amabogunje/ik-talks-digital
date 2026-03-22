import Link from "next/link";
import { CurrentFocusCard } from "@/components/current-focus-card";

type DashboardHeroProps = {
  headline: string;
  support: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  focusCard?: React.ReactNode;
};

export function DashboardHero({ headline, support, primaryHref, primaryLabel, secondaryHref, secondaryLabel, focusCard }: DashboardHeroProps) {
  return (
    <section className="grid gap-6 rounded-[1.35rem] border border-white/10 bg-[linear-gradient(135deg,rgba(234,179,8,0.14),rgba(46,46,46,0.34))] p-6 shadow-glow lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:p-8">
      <div>
        <p className="section-eyebrow">Learner control center</p>
        <h1 className="text-balance-pretty mt-4 max-w-3xl font-display text-4xl leading-[1.03] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">{headline}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">{support}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href={primaryHref} className="button-primary">
            {primaryLabel}
          </Link>
          <Link href={secondaryHref} className="button-secondary px-6">
            {secondaryLabel}
          </Link>
        </div>
      </div>
      {focusCard ?? <CurrentFocusCard eyebrow="Current focus" activeCourseLabel="Active course" currentFocusLabel="Current focus" courseProgressLabel="Course progress" courseTitle="--" courseThumbnail="/ak-hero.png.png" focusText="Keep your learning momentum going." progressPercent={0} />}
    </section>
  );
}
