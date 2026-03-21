import Link from "next/link";

type Props = {
  slug: string;
  title: string;
  description: string;
  guidance: string;
};

export function ScenarioCard({ slug, title, description, guidance }: Props) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
      <p className="text-sm uppercase tracking-[0.25em] text-gold">Guided practice</p>
      <h3 className="mt-3 font-display text-2xl text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
      <p className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-zinc-300">
        {guidance}
      </p>
      <Link href={`/practice/${slug}`} className="mt-5 inline-flex rounded-full bg-gold px-5 py-3 text-sm font-medium text-black">
        Start scenario
      </Link>
    </div>
  );
}
