export type RecommendsLanguage = "EN" | "FR";

export type RecommendationCategory =
  | "presence-confidence"
  | "voice-delivery"
  | "storytelling-structure"
  | "audience-engagement"
  | "hosting-skills"
  | "business-speaking";

export type RecommendationContentType = "video" | "article" | "podcast" | "tool";

type LocalizedText = {
  EN: string;
  FR: string;
};

export type RecommendedResource = {
  id: string;
  title: LocalizedText;
  source: string;
  contentType: RecommendationContentType;
  category: RecommendationCategory;
  summary: LocalizedText;
  ikNote: LocalizedText;
  estimatedLength: string;
  url: string;
  thumbnail: string;
  featured: boolean;
};

export const recommendationCategories: Record<RecommendationCategory, LocalizedText> = {
  "presence-confidence": {
    EN: "Presence & Confidence",
    FR: "Presence et confiance"
  },
  "voice-delivery": {
    EN: "Voice & Delivery",
    FR: "Voix et delivery"
  },
  "storytelling-structure": {
    EN: "Storytelling & Structure",
    FR: "Storytelling et structure"
  },
  "audience-engagement": {
    EN: "Audience Engagement",
    FR: "Engagement du public"
  },
  "hosting-skills": {
    EN: "MC / Hosting Skills",
    FR: "Animation et maitrise de ceremonie"
  },
  "business-speaking": {
    EN: "Business of Speaking",
    FR: "Business de la prise de parole"
  }
};

export const recommendationTypeLabels: Record<RecommendationContentType, LocalizedText> = {
  video: { EN: "Video", FR: "Video" },
  article: { EN: "Article", FR: "Article" },
  podcast: { EN: "Podcast", FR: "Podcast" },
  tool: { EN: "Tool", FR: "Outil" }
};

const sourceArtwork = {
  ted: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80",
  tedEd: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
  youtube: "https://img.youtube.com/vi/kppXsU9hCkI/hqdefault.jpg",
  event: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  business: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  podcast: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80"
} as const;

export const recommendedResources: RecommendedResource[] = [
  {
    id: "amy-cuddy-body-language",
    title: {
      EN: "Your body language may shape who you are",
      FR: "Votre langage corporel peut changer votre presence"
    },
    source: "TED",
    contentType: "video",
    category: "presence-confidence",
    summary: {
      EN: "Amy Cuddy explores how posture and physical presence can influence confidence before you even speak.",
      FR: "Amy Cuddy montre comment la posture et la presence physique peuvent influencer la confiance avant meme de parler."
    },
    ikNote: {
      EN: "Watch this before stepping on stage. Pay attention to how presence starts in the body before it ever reaches the microphone.",
      FR: "Regardez ceci avant de monter sur scene. Remarquez comment la presence commence dans le corps avant d'arriver au micro."
    },
    estimatedLength: "20 min",
    url: "https://www.ted.com/talks/amy_cuddy_your_body_language_may_shape_who_you_are",
    thumbnail: sourceArtwork.ted,
    featured: true
  },
  {
    id: "julian-treasure-listen",
    title: {
      EN: "How to speak so that people want to listen",
      FR: "Comment parler pour que les gens aient envie d'ecouter"
    },
    source: "TED",
    contentType: "video",
    category: "voice-delivery",
    summary: {
      EN: "Julian Treasure breaks down vocal habits, resonance, and practical techniques that make spoken words land with more power.",
      FR: "Julian Treasure decompose les habitudes vocales, la resonance et des techniques concretes pour donner plus d'impact a la parole."
    },
    ikNote: {
      EN: "This is one of the clearest pieces on delivery. Listen for pacing, vocal texture, and how he keeps the message practical.",
      FR: "C'est l'une des meilleures ressources sur le delivery. Ecoutez le rythme, la texture vocale et la facon dont il rend son message tres pratique."
    },
    estimatedLength: "10 min",
    url: "https://ed.ted.com/lessons/0A3PRwvK",
    thumbnail: sourceArtwork.tedEd,
    featured: true
  },
  {
    id: "nancy-duarte-structure",
    title: {
      EN: "The secret structure of great talks",
      FR: "La structure secrete des grands discours"
    },
    source: "TED",
    contentType: "video",
    category: "storytelling-structure",
    summary: {
      EN: "Nancy Duarte shows how memorable talks move between what is and what could be, helping speakers build momentum and payoff.",
      FR: "Nancy Duarte montre comment les grands discours passent du reel au possible pour construire tension, progression et impact."
    },
    ikNote: {
      EN: "Study this if your message feels flat. It will sharpen how you build movement, contrast, and a stronger close.",
      FR: "Etudiez ceci si votre message manque d'elan. Cela vous aidera a creer plus de mouvement, de contraste et une meilleure conclusion."
    },
    estimatedLength: "18 min",
    url: "https://www.ted.com/speakers/nancy_duarte",
    thumbnail: sourceArtwork.ted,
    featured: false
  },
  {
    id: "celeste-headlee-conversation",
    title: {
      EN: "10 ways to have a better conversation",
      FR: "10 facons d'avoir de meilleures conversations"
    },
    source: "TED",
    contentType: "video",
    category: "audience-engagement",
    summary: {
      EN: "Celeste Headlee shares practical habits that make listeners feel respected, included, and genuinely engaged.",
      FR: "Celeste Headlee partage des habitudes simples qui aident un public a se sentir respecte, inclus et vraiment engage."
    },
    ikNote: {
      EN: "Especially useful if you tend to speak at people instead of with them. It sharpens your listening, which always improves your speaking.",
      FR: "Tres utile si vous avez tendance a parler aux gens plutot qu'avec eux. Cela affine votre ecoute, et une meilleure ecoute rend toujours la parole meilleure."
    },
    estimatedLength: "14 min",
    url: "https://ed.ted.com/lessons/10-ways-to-have-a-better-conversation-celeste-headlee",
    thumbnail: sourceArtwork.tedEd,
    featured: false
  },
  {
    id: "vinh-giang-voice-exercises",
    title: {
      EN: "5 vocal exercises for a more powerful voice",
      FR: "5 exercices vocaux pour une voix plus puissante"
    },
    source: "YouTube / Vinh Giang",
    contentType: "video",
    category: "voice-delivery",
    summary: {
      EN: "A practical set of vocal warmups you can use before recordings, presentations, or event hosting.",
      FR: "Une serie pratique d'echauffements vocaux a utiliser avant un enregistrement, une presentation ou une animation."
    },
    ikNote: {
      EN: "Good for speakers who know what to say but still sound tight, thin, or flat. Use this before practice sessions.",
      FR: "Parfait pour les orateurs qui savent quoi dire mais sonnent encore trop serres, trop fins ou trop plats. A faire avant les sessions de pratique."
    },
    estimatedLength: "6 min",
    url: "https://www.youtube.com/watch?v=kppXsU9hCkI",
    thumbnail: sourceArtwork.youtube,
    featured: false
  },
  {
    id: "brene-brown-vulnerability",
    title: {
      EN: "The power of vulnerability",
      FR: "Le pouvoir de la vulnerabilite"
    },
    source: "TED",
    contentType: "video",
    category: "audience-engagement",
    summary: {
      EN: "Brene Brown models emotional honesty in a way that helps speakers build trust without becoming performative.",
      FR: "Brene Brown montre comment l'honnetete emotionnelle peut creer de la confiance sans tomber dans la performance artificielle."
    },
    ikNote: {
      EN: "Watch how she balances warmth, credibility, humor, and depth. This is valuable if you want audiences to feel close to you quickly.",
      FR: "Observez comment elle equilibre chaleur, credibilite, humour et profondeur. C'est precieux si vous voulez creer rapidement une vraie proximite avec le public."
    },
    estimatedLength: "20 min",
    url: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability",
    thumbnail: sourceArtwork.ted,
    featured: false
  },
  {
    id: "chris-anderson-public-speaking",
    title: {
      EN: "We can help you master public speaking",
      FR: "Nous pouvons vous aider a maitriser la prise de parole"
    },
    source: "TED-Ed",
    contentType: "article",
    category: "storytelling-structure",
    summary: {
      EN: "Chris Anderson frames public speaking as a literacy you can build with structure, connection, and repetition.",
      FR: "Chris Anderson presente la prise de parole comme une competence que l'on developpe avec structure, connexion et repetition."
    },
    ikNote: {
      EN: "A strong reset if you feel overwhelmed. It reminds you that great speaking is a craft, not a mysterious gift.",
      FR: "Un excellent recentrage si vous vous sentez submerge. Cela rappelle que parler avec impact est un metier, pas un don mysterieux."
    },
    estimatedLength: "6 min",
    url: "https://ed.ted.com/lessons/we-can-help-you-master-public-speaking-chris-anderson",
    thumbnail: sourceArtwork.tedEd,
    featured: false
  },
  {
    id: "eventbrite-host-event",
    title: {
      EN: "How to host an event successfully",
      FR: "Comment reussir l'animation d'un evenement"
    },
    source: "Eventbrite",
    contentType: "article",
    category: "hosting-skills",
    summary: {
      EN: "A practical host-focused guide on building flow, preparing the room, and thinking through the audience experience.",
      FR: "Un guide tres pratique pour preparer l'animation, construire le rythme de la salle et penser l'experience du public."
    },
    ikNote: {
      EN: "Useful for MCs and event hosts who need to think beyond the mic and manage the room as a whole experience.",
      FR: "Tres utile pour les MC et les hotes qui doivent penser au-dela du micro et gerer la salle comme une experience complete."
    },
    estimatedLength: "12 min read",
    url: "https://www.eventbrite.com/blog/ds00-how-to-host-a-kick-ass-event/",
    thumbnail: sourceArtwork.event,
    featured: false
  },
  {
    id: "speaker-lab-fee-calculator",
    title: {
      EN: "The Official Speaker Fee Calculator",
      FR: "Le calculateur officiel de tarif pour conferencier"
    },
    source: "The Speaker Lab",
    contentType: "tool",
    category: "business-speaking",
    summary: {
      EN: "A practical tool for thinking more clearly about what to charge as you move from speaking for free to speaking professionally.",
      FR: "Un outil pratique pour reflechir plus clairement a votre tarification quand vous passez de gratuit a professionnel."
    },
    ikNote: {
      EN: "This matters if you are growing into the business side of speaking. Confidence must eventually meet pricing clarity.",
      FR: "C'est important si vous entrez dans le business de la prise de parole. La confiance doit un jour rencontrer une vraie clarte sur les tarifs."
    },
    estimatedLength: "10 min",
    url: "https://thespeakerlab.com/myspeakerfee/",
    thumbnail: sourceArtwork.business,
    featured: false
  },
  {
    id: "ted-guide-book",
    title: {
      EN: "TED Talks: The Official TED Guide to Public Speaking",
      FR: "TED Talks: le guide officiel de la prise de parole"
    },
    source: "TED",
    contentType: "article",
    category: "business-speaking",
    summary: {
      EN: "A deep guide to preparing, shaping, and delivering talks that stay memorable and clear long after the event ends.",
      FR: "Un guide de fond pour preparer, structurer et presenter des interventions memorables et claires longtemps apres l'evenement."
    },
    ikNote: {
      EN: "Use this when you want the bigger mental model behind great talks, not just quick tips. It sharpens judgment.",
      FR: "A utiliser quand vous voulez la grande vision derriere les grands discours, pas seulement des astuces rapides. Cela affine le jugement."
    },
    estimatedLength: "15 min read",
    url: "https://www.ted.com/read/ted-books/ted-talks-the-official-ted-guide-to-public-speaking",
    thumbnail: sourceArtwork.ted,
    featured: false
  },
  {
    id: "brene-brown-podcast-boundaries",
    title: {
      EN: "Brene Brown on what vulnerability isn't",
      FR: "Brene Brown sur ce que la vulnerabilite n'est pas"
    },
    source: "TED / WorkLife",
    contentType: "podcast",
    category: "audience-engagement",
    summary: {
      EN: "A thoughtful conversation on vulnerability, boundaries, and how to show honesty without losing structure or professionalism.",
      FR: "Une conversation riche sur la vulnerabilite, les limites et la facon d'etre authentique sans perdre structure ni professionnalisme."
    },
    ikNote: {
      EN: "Important if you want to sound human on stage without oversharing. The nuance here is useful for modern speakers and hosts.",
      FR: "Important si vous voulez paraitre humain sur scene sans trop en dire. Cette nuance est tres utile pour les orateurs et les animateurs d'aujourd'hui."
    },
    estimatedLength: "29 min",
    url: "https://www.ted.com/pages/brene-brown-on-what-vulnerability-isnt-transcript",
    thumbnail: sourceArtwork.podcast,
    featured: false
  }
];

export function getLocalizedText(value: LocalizedText, language: RecommendsLanguage) {
  return value[language];
}
