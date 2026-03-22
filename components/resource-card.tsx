import Image from "next/image";
import Link from "next/link";
import type { RecommendationContentType } from "@/lib/recommends";
import { ResourceTypeIcon } from "@/components/resource-type-icon";

type Props = {
  title: string;
  source: string;
  typeLabel: string;
  contentType: RecommendationContentType;
  categoryLabel: string;
  summary: string;
  ikNote: string;
  estimatedLength: string;
  url: string;
  thumbnail: string;
  ctaLabel: string;
  whyLabel: string;
};

export function ResourceCard({ title, source, typeLabel, contentType, categoryLabel, summary, ikNote, estimatedLength, url, thumbnail, ctaLabel, whyLabel }: Props) {
  return (
    <Link href={url} target="_blank" rel="noreferrer" className="group block h-full">
      <article className="surface-card-soft flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-gold/25 hover:bg-[rgba(42,42,42,0.86)]">
        <div className="relative h-44 overflow-hidden">
          <Image src={thumbnail} alt={title} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-4">
            <span className="inline-flex rounded-[0.45rem] border border-white/10 bg-black/35 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-zinc-200 backdrop-blur-sm">
              {categoryLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-zinc-400">
              <span className="text-gold">{source}</span>
              <span className="inline-flex items-center gap-2">
                <ResourceTypeIcon contentType={contentType} className="h-3.5 w-3.5" />
                {typeLabel}
              </span>
              <span>{estimatedLength}</span>
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-[1.45rem] leading-tight tracking-[-0.03em] text-white">{title}</h3>
              <p className="text-sm leading-7 text-zinc-400">{summary}</p>
            </div>

            <div className="rounded-[0.8rem] border border-white/10 bg-black/20 p-4">
              <p className="section-eyebrow">{whyLabel}</p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{ikNote}</p>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 via-gold/25 to-transparent" />
            <span className="button-secondary px-4 py-2.5 text-sm">{ctaLabel}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
