import { prisma } from "@/lib/prisma";
import { SiteShell } from "@/components/site-shell";
import { RecommendsBrowser } from "@/components/recommends-browser";
import { RecommendsHero } from "@/components/recommends-hero";
import { requireUser } from "@/lib/auth";
import { normalizeLanguage } from "@/lib/locale";
import {
  getLocalizedText,
  recommendationCategories,
  recommendedResources,
  recommendationTypeLabels,
  type RecommendationContentType,
  type RecommendationCategory,
  type RecommendsLanguage
} from "@/lib/recommends";

const pageCopy = {
  EN: {
    eyebrow: "IK Recommends",
    title: "",
    subtitle: "These handpicked lessons, talks, articles, and tools are here to sharpen your presence, voice, storytelling, audience control, and the business side of speaking.",
    description: "",
    spotlightTitle: "Spotlight picks",
    spotlightIntro: "Start with the standout resources IK would put in front of a serious speaker first. These are strong reset points for presence, delivery, and message control.",
    collectionTitle: "The collection",
    collectionIntro: "Every other recommendation lives here so you can keep going through IK's curated picks one resource at a time.",
    whyLabel: "Why IK recommends this",
    openResource: "Open resource"
  },
  FR: {
    eyebrow: "IK Recommends",
    title: "",
    subtitle: "Ces lecons, talks, articles et outils choisis avec soin sont la pour affiner votre presence, votre voix, votre storytelling, votre maitrise du public et le cote business de la prise de parole.",
    description: "",
    spotlightTitle: "Picks a la une",
    spotlightIntro: "Commencez par les ressources qu'IK mettrait d'abord devant un orateur serieux. Ce sont de tres bons points d'entree pour la presence, le delivery et la maitrise du message.",
    collectionTitle: "La collection",
    collectionIntro: "Toutes les autres recommandations vivent ici pour vous permettre d'avancer dans les picks choisis par IK, une ressource a la fois.",
    whyLabel: "Pourquoi IK recommande ceci",
    openResource: "Ouvrir la ressource"
  }
} as const;

const validContentTypes = new Set<RecommendationContentType>(["video", "article", "podcast", "tool"]);
const validCategories = new Set<RecommendationCategory>([
  "presence-confidence",
  "voice-delivery",
  "storytelling-structure",
  "audience-engagement",
  "hosting-skills",
  "business-speaking"
]);

export default async function RecommendsPage() {
  const user = await requireUser();
  const language = normalizeLanguage(user.language) as RecommendsLanguage;
  const copy = pageCopy[language];

  const storedResources = await prisma.recommendationResource.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }]
  });

  const resources = (storedResources.length ? storedResources.map((resource) => ({
    id: resource.id,
    title: language === "FR" ? resource.titleFr || resource.titleEn : resource.titleEn,
    source: resource.source,
    typeLabel: getLocalizedText(
      recommendationTypeLabels[validContentTypes.has(resource.contentType as RecommendationContentType) ? (resource.contentType as RecommendationContentType) : "video"],
      language
    ),
    contentType: validContentTypes.has(resource.contentType as RecommendationContentType) ? (resource.contentType as RecommendationContentType) : "video",
    categoryLabel: getLocalizedText(
      recommendationCategories[validCategories.has(resource.category as RecommendationCategory) ? (resource.category as RecommendationCategory) : "presence-confidence"],
      language
    ),
    summary: language === "FR" ? resource.summaryFr || resource.summaryEn : resource.summaryEn,
    ikNote: language === "FR" ? resource.ikNoteFr || resource.ikNoteEn : resource.ikNoteEn,
    estimatedLength: resource.estimatedLength,
    url: resource.url,
    thumbnail: resource.thumbnail,
    featured: resource.featured
  })) : recommendedResources.map((resource) => ({
    id: resource.id,
    title: getLocalizedText(resource.title, language),
    source: resource.source,
    typeLabel: getLocalizedText(recommendationTypeLabels[resource.contentType], language),
    contentType: resource.contentType,
    categoryLabel: getLocalizedText(recommendationCategories[resource.category], language),
    summary: getLocalizedText(resource.summary, language),
    ikNote: getLocalizedText(resource.ikNote, language),
    estimatedLength: resource.estimatedLength,
    url: resource.url,
    thumbnail: resource.thumbnail,
    featured: resource.featured
  })));

  return (
    <SiteShell language={user.language} role={user.role}>
      <div className="space-y-8 sm:space-y-10">
        <RecommendsHero eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} description={copy.description} />

        <div id="ik-recommends-library">
          <RecommendsBrowser copy={copy} resources={resources} />
        </div>
      </div>
    </SiteShell>
  );
}

