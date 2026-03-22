import { AdminRecommendsManager } from "@/components/admin-recommends-manager";
import { requireAdmin } from "@/lib/auth";
import { ensureRecommendationsSeeded, getAdminContext } from "@/lib/admin";
import { getDictionary } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export default async function AdminRecommendsPage() {
  const user = await requireAdmin();
  const dict = getDictionary(user.language);
  const { copy, language } = await getAdminContext(user.language);

  await ensureRecommendationsSeeded();
  const recommendationResources = await prisma.recommendationResource.findMany({ orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }] });

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="section-title">{copy.recommendsNav}</h2>
        <p className="max-w-3xl text-sm leading-7 text-zinc-400">{copy.recommendsIntro}</p>
      </section>

      <AdminRecommendsManager
        resources={recommendationResources.map((resource) => ({
          id: resource.id,
          titleEn: resource.titleEn,
          titleFr: resource.titleFr ?? "",
          source: resource.source,
          contentType: resource.contentType,
          category: resource.category,
          summaryEn: resource.summaryEn,
          summaryFr: resource.summaryFr ?? "",
          ikNoteEn: resource.ikNoteEn,
          ikNoteFr: resource.ikNoteFr ?? "",
          estimatedLength: resource.estimatedLength,
          url: resource.url,
          thumbnail: resource.thumbnail,
          featured: resource.featured,
          active: resource.active,
          sortOrder: resource.sortOrder
        }))}
        copy={{
          title: copy.recommendsTitle,
          chooser: copy.chooser,
          newLabel: copy.newLabel,
          titleEn: copy.titleEn,
          titleFr: copy.titleFr,
          source: copy.source,
          contentType: copy.contentType,
          category: copy.category,
          summaryEn: copy.summaryEn,
          summaryFr: copy.summaryFr,
          ikNoteEn: copy.ikNoteEn,
          ikNoteFr: copy.ikNoteFr,
          estimatedLength: copy.estimatedLength,
          url: dict.open,
          thumbnail: copy.thumbnail,
          featured: copy.featured,
          active: copy.active,
          sortOrder: copy.sortOrder,
          create: copy.createRecommendation,
          update: copy.updateRecommendation,
          delete: copy.deleteRecommendation,
          reset: copy.resetForm,
          saved: copy.recommendationSaved,
          failed: copy.recommendationFailed,
          deleted: copy.recommendationDeleted,
          video: copy.video,
          article: copy.article,
          podcast: copy.podcast,
          tool: copy.tool,
          presence: copy.presence,
          voice: copy.voice,
          storytelling: copy.storytelling,
          audience: copy.audience,
          hosting: copy.hostingTrack,
          business: copy.business,
          existing: copy.existingHint
        }}
      />

      <div className="surface-card p-5 sm:p-6">
        <h3 className="font-display text-2xl text-white">{copy.existingListTitle}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{copy.existingListIntro}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recommendationResources.map((resource) => (
            <div key={resource.id} className="rounded-[1rem] border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg text-white">{language === "FR" ? resource.titleFr || resource.titleEn : resource.titleEn}</p>
                {resource.featured ? <span className="rounded-[0.55rem] border border-gold/20 bg-gold/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-gold">{copy.featuredBadge}</span> : null}
              </div>
              <p className="mt-1 text-sm text-zinc-400">{resource.source} - {resource.contentType}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">{resource.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
