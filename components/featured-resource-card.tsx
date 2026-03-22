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

export function FeaturedResourceCard({ title, source, typeLabel, contentType, categoryLabel, summary, ikNote, estimatedLength, url, thumbnail, ctaLabel, whyLabel }: Props) {
  return (
    <Link href={url} target="_blank" rel="noreferrer" className="group block">
      <article className="surface-card overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-gold/30">
        <div className="relative h-56 overflow-hidden sm:h-64">
          <Image src={thumbnail} alt={title} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
          <div className="absolute inset-x-0 top-0 flex flex-wrap items-center gap-2 px-5 pt-5 text-xs uppercase tracking-[0.24em] text-zinc-200 sm:px-6 sm:pt-6">
            <span className="text-gold">{source}</span>
            <span className="text-white/25">/</span>
            <span className="inline-flex items-center gap-2">
              <ResourceTypeIcon contentType={contentType} className="h-3.5 w-3.5" />
              {typeLabel}
            </span>
            <span className="text-white/25">/</span>
            <span>{estimatedLength}</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 px-5 pb-5 sm:px-6 sm:pb-6">
            <span className="inline-flex rounded-[0.45rem] border border-gold/20 bg-gold/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-gold">
              {categoryLabel}
            </span>
            <h3 className="mt-3 font-display text-2xl leading-tight tracking-[-0.03em] text-white sm:text-[2rem]">{title}</h3>
          </div>
        </div>

        <div className="flex h-full flex-col justify-between gap-6 p-5 sm:p-6 lg:p-7">
          <div className="space-y-5">
            <p className="text-sm leading-7 text-zinc-300 sm:text-base">{summary}</p>

            <div className="rounded-[0.8rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="section-eyebrow">{whyLabel}</p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{ikNote}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-gold/40 via-white/10 to-transparent" />
            <span className="button-accent-outline px-5 py-3 text-sm">{ctaLabel}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
