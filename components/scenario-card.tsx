import Link from "next/link";

type Props = {
  slug: string;
  title: string;
  description: string;
  guidance: string;
};

export function ScenarioCard({ slug, title, description, guidance }: Props) {
  return (
    <div className="surface-card p-5 sm:p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-gold sm:text-sm">Guided practice</p>
      <h3 className="mt-3 font-display text-xl text-white sm:text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
      <p className="surface-card-muted mt-4 p-4 text-sm leading-6 text-zinc-300">
        {guidance}
      </p>
      <Link href={`/practice/${slug}`} className="button-primary mt-5 w-full px-5 text-sm sm:w-auto">
        Start scenario
      </Link>
    </div>
  );
}
