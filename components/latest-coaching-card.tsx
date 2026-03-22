import Link from "next/link";

type LatestCoachingCardProps = {
  title: string;
  practiceHref: string;
  practiceLabel: string;
  body: string;
  preview: string;
};

export function LatestCoachingCard(props: LatestCoachingCardProps) {
  return (
    <div className="surface-card border-gold/15 bg-[linear-gradient(180deg,rgba(234,179,8,0.12),rgba(255,255,255,0.03))] p-4 sm:p-5 lg:p-6">
      <h2 className="font-display text-xl text-white sm:text-2xl lg:text-[2rem]">{props.title}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-300">{props.body}</p>
      <div className="mt-4 rounded-[0.8rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200">
        {props.preview}
      </div>
      <Link href={props.practiceHref} className="button-primary mt-5 w-full px-5 text-center sm:w-auto">
        {props.practiceLabel}
      </Link>
    </div>
  );
}
