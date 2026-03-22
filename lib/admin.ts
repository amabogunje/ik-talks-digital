import { Language } from "@prisma/client";
import { normalizeLanguage } from "@/lib/locale";
import { prisma } from "@/lib/prisma";
import { recommendedResources } from "@/lib/recommends";

export const adminSectionCopy = {
  EN: {
    workspaceTitle: "Admin workspace",
    workspaceIntro: "Manage the learning catalog, practice prompts, script templates, and curated IK recommendations from one focused control center.",
    coursesNav: "Course manager",
    scenariosNav: "Practice manager",
    templatesNav: "Script manager",
    recommendsNav: "Recommendation manager",
    skillArea: "Skill area",
    level: "Level",
    featured: "Featured course",
    published: "Published",
    publicSpeaking: "Public speaking",
    hosting: "Hosting",
    communication: "Communication",
    beginner: "Beginner",
    advanced: "Advanced",
    featuredBadge: "Featured",
    coursesIntro: "Create and review the core learning paths learners see in the course library.",
    scenariosIntro: "Manage the practice moments learners use to rehearse their delivery and receive coaching.",
    templatesIntro: "Shape the script scaffolds used to generate speaking drafts inside the studio.",
    recommendsIntro: "Edit the curated external resources that power the IK Recommends experience.",
    recommendsTitle: "Recommendation manager",
    chooser: "Choose an existing recommendation to edit",
    newLabel: "Create a new recommendation",
    titleEn: "Title (English)",
    titleFr: "Title (French)",
    source: "Source",
    contentType: "Content type",
    category: "Track",
    summaryEn: "Summary (English)",
    summaryFr: "Summary (French)",
    ikNoteEn: "Why IK recommends this (English)",
    ikNoteFr: "Why IK recommends this (French)",
    estimatedLength: "Estimated length",
    thumbnail: "Thumbnail URL",
    sortOrder: "Sort order",
    active: "Active",
    createRecommendation: "Create recommendation",
    updateRecommendation: "Update recommendation",
    deleteRecommendation: "Delete recommendation",
    resetForm: "Reset form",
    recommendationSaved: "Recommendation saved successfully.",
    recommendationFailed: "Unable to save recommendation.",
    recommendationDeleted: "Recommendation deleted.",
    video: "Video",
    article: "Article",
    podcast: "Podcast",
    tool: "Tool",
    presence: "Presence & Confidence",
    voice: "Voice & Delivery",
    storytelling: "Storytelling & Structure",
    audience: "Audience Engagement",
    hostingTrack: "MC / Hosting Skills",
    business: "Business of Speaking",
    existingHint: "Use this editor to create new recommendations or update the spotlight and collection items already showing on the learner page.",
    existingListTitle: "Existing recommendations",
    existingListIntro: "Use this list as a quick reference, then choose any item from the editor dropdown when you want to update it."
  },
  FR: {
    workspaceTitle: "Espace admin",
    workspaceIntro: "Gerez le catalogue de formation, les prompts de pratique, les modeles de scripts et les recommandations IK depuis un seul espace clair.",
    coursesNav: "Gestion des cours",
    scenariosNav: "Gestion de la pratique",
    templatesNav: "Gestion des scripts",
    recommendsNav: "Gestion des recommandations",
    skillArea: "Domaine",
    level: "Niveau",
    featured: "Cours en vedette",
    published: "Publie",
    publicSpeaking: "Prise de parole",
    hosting: "Animation",
    communication: "Communication",
    beginner: "Debutant",
    advanced: "Avance",
    featuredBadge: "En vedette",
    coursesIntro: "Creez et pilotez les parcours de formation principaux visibles dans la bibliotheque de cours.",
    scenariosIntro: "Gerez les situations de pratique que les apprenants utilisent pour s'entrainer et recevoir du coaching.",
    templatesIntro: "Pilotez les structures de scripts utilisees dans le studio pour generer des brouillons de prise de parole.",
    recommendsIntro: "Modifiez les ressources externes choisies qui alimentent l'experience IK Recommends.",
    recommendsTitle: "Gestion des recommandations",
    chooser: "Choisissez une recommandation existante a modifier",
    newLabel: "Creer une nouvelle recommandation",
    titleEn: "Titre (anglais)",
    titleFr: "Titre (francais)",
    source: "Source",
    contentType: "Format",
    category: "Parcours",
    summaryEn: "Resume (anglais)",
    summaryFr: "Resume (francais)",
    ikNoteEn: "Pourquoi IK recommande ceci (anglais)",
    ikNoteFr: "Pourquoi IK recommande ceci (francais)",
    estimatedLength: "Duree estimee",
    thumbnail: "URL de miniature",
    sortOrder: "Ordre d'affichage",
    active: "Actif",
    createRecommendation: "Creer la recommandation",
    updateRecommendation: "Mettre a jour la recommandation",
    deleteRecommendation: "Supprimer la recommandation",
    resetForm: "Reinitialiser",
    recommendationSaved: "Recommandation enregistree avec succes.",
    recommendationFailed: "Impossible d'enregistrer la recommandation.",
    recommendationDeleted: "Recommandation supprimee.",
    video: "Video",
    article: "Article",
    podcast: "Podcast",
    tool: "Outil",
    presence: "Presence et confiance",
    voice: "Voix et delivery",
    storytelling: "Storytelling et structure",
    audience: "Engagement du public",
    hostingTrack: "Animation et maitrise de ceremonie",
    business: "Business de la prise de parole",
    existingHint: "Utilisez cet editeur pour creer de nouvelles recommandations ou mettre a jour les picks deja visibles sur la page apprenant.",
    existingListTitle: "Recommandations existantes",
    existingListIntro: "Utilisez cette liste comme repere rapide, puis choisissez un element dans le menu deroulant de l'editeur pour le modifier."
  }
} as const;

export const skillAreaLabels = {
  EN: {
    PUBLIC_SPEAKING: "Public speaking",
    HOSTING: "Hosting",
    COMMUNICATION: "Communication"
  },
  FR: {
    PUBLIC_SPEAKING: "Prise de parole",
    HOSTING: "Animation",
    COMMUNICATION: "Communication"
  }
} as const;

export const levelLabels = {
  EN: {
    BEGINNER: "Beginner",
    ADVANCED: "Advanced"
  },
  FR: {
    BEGINNER: "Debutant",
    ADVANCED: "Avance"
  }
} as const;

export async function ensureRecommendationsSeeded() {
  const count = await prisma.recommendationResource.count();
  if (count > 0) return;

  await prisma.recommendationResource.createMany({
    data: recommendedResources.map((resource, index) => ({
      titleEn: resource.title.EN,
      titleFr: resource.title.FR,
      source: resource.source,
      contentType: resource.contentType,
      category: resource.category,
      summaryEn: resource.summary.EN,
      summaryFr: resource.summary.FR,
      ikNoteEn: resource.ikNote.EN,
      ikNoteFr: resource.ikNote.FR,
      estimatedLength: resource.estimatedLength,
      url: resource.url,
      thumbnail: resource.thumbnail,
      featured: resource.featured,
      active: true,
      sortOrder: index
    }))
  });
}

export async function getAdminContext(userLanguage: Language) {
  const language = normalizeLanguage(userLanguage);
  return {
    language,
    copy: adminSectionCopy[language]
  };
}
