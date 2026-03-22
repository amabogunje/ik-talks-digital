import Link from "next/link";

type LatestCoachingCardProps = {
  title: string;
  scenarioTitle?: string | null;
  contextLabel: string;
  confidenceLabel: string;
  confidenceValue?: string | null;
  clarityLabel: string;
  clarityValue?: string | null;
  summary?: string | null;
  topTipLabel: string;
  topTip?: string | null;
  feedbackHref?: string;
  feedbackLabel: string;
  practiceHref: string;
  practiceLabel: string;
  emptyTitle?: string;
  emptyBody?: string;
  emptyPreview?: string;
};

export function LatestCoachingCard(props: LatestCoachingCardProps) {
  const hasFeedback = Boolean(props.scenarioTitle && props.summary);

  return (
    <div className="surface-card p-4 sm:p-5 lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl text-white sm:text-2xl lg:text-3xl">{props.title}</h2>
      </div>

      {hasFeedback ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-[0.95rem] border border-gold/15 bg-gold/10 p-4">
            <p className="text-xs uppercase tracking-[0.26em] text-gold">{props.contextLabel}</p>
            <p className="mt-2 text-lg text-white sm:text-xl">{props.scenarioTitle}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="surface-card-muted p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{props.confidenceLabel}</p>
              <p className="mt-1 font-display text-2xl text-white sm:text-3xl">{props.confidenceValue}</p>
            </div>
            <div className="surface-card-muted p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{props.clarityLabel}</p>
              <p className="mt-1 font-display text-2xl text-white sm:text-3xl">{props.clarityValue}</p>
            </div>
          </div>
          <p className="surface-card-muted p-4 text-sm leading-6 text-zinc-300">{props.summary}</p>
          <div className="surface-card-soft p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{props.topTipLabel}</p>
            <p className="mt-1 text-sm leading-6 text-white">{props.topTip}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {props.feedbackHref ? (
              <Link href={props.feedbackHref} className="button-primary w-full px-5 text-center sm:w-auto">
                {props.feedbackLabel}
              </Link>
            ) : null}
            <Link href={props.practiceHref} className="button-secondary w-full px-5 text-center sm:w-auto">
              {props.practiceLabel}
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-[0.95rem] border border-gold/15 bg-[linear-gradient(180deg,rgba(234,179,8,0.1),rgba(255,255,255,0.03))] p-4 sm:p-5">
          <p className="font-display text-xl text-white sm:text-2xl">{props.emptyTitle}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{props.emptyBody}</p>
          {props.emptyPreview ? (
            <div className="mt-4 rounded-[0.8rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200">
              {props.emptyPreview}
            </div>
          ) : null}
          <Link href={props.practiceHref} className="button-primary mt-5 w-full px-5 text-center sm:w-auto">
            {props.practiceLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
