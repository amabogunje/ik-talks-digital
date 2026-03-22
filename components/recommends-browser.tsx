import { FeaturedResourceCard } from "@/components/featured-resource-card";
import { ResourceCard } from "@/components/resource-card";
import type { RecommendationContentType } from "@/lib/recommends";

type ResourceItem = {
  id: string;
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
  featured: boolean;
};

type Copy = {
  spotlightTitle: string;
  spotlightIntro: string;
  collectionTitle: string;
  collectionIntro: string;
  whyLabel: string;
  openResource: string;
};

type Props = {
  copy: Copy;
  resources: ResourceItem[];
};

export function RecommendsBrowser({ copy, resources }: Props) {
  const featuredResources = resources.filter((resource) => resource.featured).slice(0, 2);
  const libraryResources = resources.filter((resource) => !featuredResources.some((featured) => featured.id === resource.id));

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="section-title">{copy.spotlightTitle}</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gold/35 via-white/10 to-transparent" />
        </div>
        <p className="max-w-3xl text-sm leading-7 text-zinc-400">{copy.spotlightIntro}</p>
        <div className="grid gap-4 lg:grid-cols-2">
          {featuredResources.map((resource) => (
            <FeaturedResourceCard
              key={resource.id}
              title={resource.title}
              source={resource.source}
              typeLabel={resource.typeLabel}
              contentType={resource.contentType}
              categoryLabel={resource.categoryLabel}
              summary={resource.summary}
              ikNote={resource.ikNote}
              estimatedLength={resource.estimatedLength}
              url={resource.url}
              thumbnail={resource.thumbnail}
              ctaLabel={copy.openResource}
              whyLabel={copy.whyLabel}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="section-title">{copy.collectionTitle}</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gold/35 via-white/10 to-transparent" />
        </div>
        <p className="max-w-3xl text-sm leading-7 text-zinc-400">{copy.collectionIntro}</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {libraryResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              title={resource.title}
              source={resource.source}
              typeLabel={resource.typeLabel}
              contentType={resource.contentType}
              categoryLabel={resource.categoryLabel}
              summary={resource.summary}
              ikNote={resource.ikNote}
              estimatedLength={resource.estimatedLength}
              url={resource.url}
              thumbnail={resource.thumbnail}
              ctaLabel={copy.openResource}
              whyLabel={copy.whyLabel}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
