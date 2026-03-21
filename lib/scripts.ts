import { Language } from "@prisma/client";
import { normalizeLanguage, SupportedLanguage } from "@/lib/locale";

type ScriptOptions = {
  scenarioTitle: string;
  tone: string;
  audience: string;
  length: string;
  language: Language;
  template?: string | null;
  additionalContext?: string | null;
};

type ContextDetails = {
  occasionLine?: string;
  milestoneLine?: string;
  personalLine?: string;
  closeLine?: string;
};

function normalizeLength(length: string) {
  return length === "short" || length === "long" ? length : "medium";
}

function getScenarioType(scenarioTitle: string) {
  const value = scenarioTitle.toLowerCase();
  if (value.includes("wedding")) return "wedding";
  if (value.includes("corporate")) return "corporate";
  if (value.includes("panel")) return "panel";
  if (value.includes("personal")) return "personal";
  return "general";
}

function getEnglishAudienceLine(audience: string) {
  if (audience === "wedding") return "family, friends, and loved ones gathered here tonight";
  if (audience === "corporate") return "distinguished guests, partners, and colleagues in the room";
  if (audience === "youth") return "the brilliant young people and changemakers here today";
  if (audience === "community") return "the community members and supporters gathered here";
  return "everyone here with us today";
}

function getFrenchAudienceLine(audience: string) {
  if (audience === "wedding") return "les familles, les amis et les proches reunis ce soir";
  if (audience === "corporate") return "les invites, partenaires et collegues presents dans la salle";
  if (audience === "youth") return "les jeunes talents et les leaders reunis aujourd'hui";
  if (audience === "community") return "les membres de la communaute et les soutiens reunis ici";
  return "toutes les personnes presentes aujourd'hui";
}

function getEnglishToneStyle(tone: string) {
  if (tone === "formal") {
    return {
      opener: "Good evening, everyone.",
      connector: "It is a real privilege to stand before you.",
      energyLine: "We gather with gratitude, with dignity, and with a shared sense of purpose."
    };
  }
  if (tone === "energetic") {
    return {
      opener: "Good evening, beautiful people.",
      connector: "What a joy it is to stand in this moment with all of you.",
      energyLine: "We are here with purpose, with joy, and with real excitement for what this moment means."
    };
  }
  return {
    opener: "Good evening, everyone.",
    connector: "It is such a pleasure to be here with you.",
    energyLine: "We are gathered in a warm and meaningful moment, surrounded by people who truly matter."
  };
}

function getFrenchToneStyle(tone: string) {
  if (tone === "formal") {
    return {
      opener: "Bonsoir a toutes et a tous.",
      connector: "C'est un reel privilege de prendre la parole devant vous.",
      energyLine: "Nous nous retrouvons avec gratitude, avec dignite et avec un vrai sens du moment."
    };
  }
  if (tone === "energetic") {
    return {
      opener: "Bonsoir a toutes et a tous.",
      connector: "Quelle joie de vivre ce moment avec vous.",
      energyLine: "Nous sommes ici avec de l'elan, de la joie et une vraie energie pour ce que ce moment represente."
    };
  }
  return {
    opener: "Bonsoir a toutes et a tous.",
    connector: "Je suis tres heureux d'etre avec vous ce soir.",
    energyLine: "Nous partageons un moment chaleureux et important, entoures de personnes qui comptent vraiment."
  };
}

function parseContextValue(rawContext?: string | null) {
  return rawContext?.replace(/\s+/g, " ").trim();
}

function findNamedPerson(context: string) {
  const patterns = [
    /\b([A-Z][a-z]+)\s+(?:just\s+)?retired\b/,
    /\b([A-Z][a-z]+)'s\s+(?:retirement|birthday|promotion|farewell)\b/,
    /\bfor\s+([A-Z][a-z]+)\b/,
    /\bcelebrating\s+([A-Z][a-z]+)\b/
  ];

  for (const pattern of patterns) {
    const match = context.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return undefined;
}

function findOrganization(context: string) {
  const possessiveMatch = context.match(/\b([A-Z][A-Za-z0-9&.\- ]+?)'s\s+(annual|end-of-year|christmas|holiday|awards|leadership)\b/i);
  if (possessiveMatch?.[1]) {
    return possessiveMatch[1].trim();
  }

  const atMatch = context.match(/\bat\s+([A-Z][A-Za-z0-9&.\- ]+?)(?:\s+(?:annual|christmas|holiday|gala|conference|summit|party)\b|$)/i);
  if (atMatch?.[1]) {
    return atMatch[1].trim();
  }

  return undefined;
}

function findBirthdayAge(context: string) {
  const match = context.match(/\b(\d{2})(?:nd|rd|th|st)?\s+birthday\b/i);
  return match?.[1];
}

function findSiblingCount(context: string) {
  const match = context.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+sisters?\b/i);
  return match?.[1];
}

function buildEnglishContextDetails(context: string, scenarioType: string, audience: string, tone: string): ContextDetails {
  const lower = context.toLowerCase();
  const person = findNamedPerson(context);
  const organization = findOrganization(context);
  const age = findBirthdayAge(context);
  const siblings = findSiblingCount(context);

  const details: ContextDetails = {};

  if (scenarioType === "corporate" || lower.includes("corporate") || lower.includes("company") || lower.includes("office")) {
    if (organization && (lower.includes("christmas") || lower.includes("holiday"))) {
      details.occasionLine = `Tonight, we have the pleasure of coming together for ${organization}'s holiday celebration, a chance to reflect, reconnect, and enjoy the people who make this place special.`;
    } else if (organization && lower.includes("annual")) {
      details.occasionLine = `It is wonderful to gather for ${organization}'s annual celebration, with room for reflection, connection, and a little well-earned joy.`;
    } else {
      details.occasionLine = "This is a moment to celebrate good work, shared effort, and the people whose presence gives an event like this its meaning.";
    }
  } else if (scenarioType === "wedding") {
    details.occasionLine = "We are here for a beautiful occasion, one filled with love, gratitude, and the kind of joy that deserves to be shared out loud.";
  } else if (lower.includes("birthday")) {
    details.occasionLine = age
      ? `We are gathered to celebrate a remarkable ${age}th birthday, and that gives this room every reason to be full of warmth, laughter, and gratitude.`
      : "We are gathered to celebrate a special birthday, and that gives this room every reason to be full of warmth, laughter, and gratitude.";
  } else if (lower.includes("farewell")) {
    details.occasionLine = "We are sharing a meaningful farewell, one of those moments that carries gratitude, reflection, and hope for what comes next.";
  } else {
    details.occasionLine = "This is a meaningful occasion, and it deserves the kind of presence, warmth, and attention that makes people feel part of something special.";
  }

  if (lower.includes("retired") || lower.includes("retirement")) {
    details.milestoneLine = person
      ? tone === "energetic"
        ? `And of course, we cannot let this gathering pass without celebrating ${person}, who has stepped into retirement and earned every bit of the applause that comes with it.`
        : `And we would be remiss not to recognize ${person}, who is stepping into retirement after a season of service worth honoring.`
      : tone === "energetic"
        ? "And of course, we cannot let this moment pass without celebrating a well-earned retirement and the journey behind it."
        : "And we would be remiss not to recognize a well-earned retirement and the years of service behind it.";

    if (scenarioType === "corporate") {
      details.personalLine = person
        ? `If there is one bright side for ${person}, it is that the calendar may still be full, but at least the meetings are now optional.`
        : "The good news is that the next chapter comes with fewer meetings and a lot more freedom.";
    }
  } else if (lower.includes("promotion") || lower.includes("promoted")) {
    details.milestoneLine = person
      ? `We also celebrate ${person}, whose promotion reflects hard work, trust, and the kind of steady excellence people notice.`
      : "We also celebrate a promotion that reflects hard work, trust, and the kind of steady excellence people notice.";
  } else if (lower.includes("birthday")) {
    details.milestoneLine = person
      ? `And tonight, we get to celebrate ${person}, whose life, story, and impact have given everyone here a reason to smile.`
      : "And tonight, we get to celebrate someone whose life and story have given everyone here a reason to smile.";
  } else if (lower.includes("farewell")) {
    details.milestoneLine = person
      ? `We also pause to honor ${person}, whose farewell reminds us that goodbyes are often a sign that meaningful work has been done.`
      : "We also pause to honor a farewell that reminds us that goodbyes are often a sign that meaningful work has been done.";
  }

  if (siblings) {
    details.personalLine = "You can already feel that this is the kind of occasion shaped by family, history, and the people who know the story behind the smiles in this room.";
  } else if (audience === "wedding") {
    details.personalLine = details.personalLine ?? "You can feel the love in this room already, and that kind of atmosphere makes every word land with more meaning.";
  } else if (audience === "community") {
    details.personalLine = details.personalLine ?? "There is something powerful about a room where people show up not out of obligation, but because this moment truly matters to them.";
  }

  details.closeLine = scenarioType === "corporate"
    ? "So let us enjoy the moment, honor the people at the center of it, and set the tone for a memorable evening."
    : "So let us enjoy this moment fully, honor the people at the heart of it, and make the room feel alive from the very first line.";

  return details;
}

function buildFrenchContextDetails(context: string, scenarioType: string, audience: string, tone: string): ContextDetails {
  const lower = context.toLowerCase();
  const person = findNamedPerson(context);
  const organization = findOrganization(context);
  const age = findBirthdayAge(context);
  const siblings = findSiblingCount(context);

  const details: ContextDetails = {};

  if (scenarioType === "corporate" || lower.includes("corporate") || lower.includes("company") || lower.includes("office")) {
    if (organization && (lower.includes("christmas") || lower.includes("holiday"))) {
      details.occasionLine = `Ce soir, nous avons le plaisir de nous retrouver pour la fete de fin d'annee de ${organization}, un moment pour se retrouver, souffler et celebrer celles et ceux qui font la force de cette maison.`;
    } else if (organization && lower.includes("annual")) {
      details.occasionLine = `Quel plaisir de nous retrouver pour la celebration annuelle de ${organization}, avec de l'espace pour la reconnaissance, la connexion et une joie bien meritee.`;
    } else {
      details.occasionLine = "C'est un moment pour celebrer le travail accompli, l'effort partage et les personnes qui donnent a cette rencontre toute sa valeur.";
    }
  } else if (scenarioType === "wedding") {
    details.occasionLine = "Nous sommes reunis pour une tres belle occasion, remplie d'amour, de gratitude et d'une joie qui merite d'etre partagee pleinement.";
  } else if (lower.includes("birthday")) {
    details.occasionLine = age
      ? `Nous sommes reunis pour celebrer un magnifique ${age}e anniversaire, et cette salle a toutes les raisons d'etre remplie de chaleur, de sourires et de reconnaissance.`
      : "Nous sommes reunis pour celebrer un anniversaire tres special, et cette salle a toutes les raisons d'etre remplie de chaleur, de sourires et de reconnaissance.";
  } else if (lower.includes("farewell")) {
    details.occasionLine = "Nous partageons un au revoir important, un de ces moments qui melangent gratitude, emotion et confiance pour la suite.";
  } else {
    details.occasionLine = "C'est une occasion importante, et elle merite une presence, une chaleur et une attention qui donnent a chacun le sentiment de faire partie de quelque chose de special.";
  }

  if (lower.includes("retired") || lower.includes("retirement")) {
    details.milestoneLine = person
      ? tone === "energetic"
        ? `Et bien sur, nous ne pouvions pas laisser passer cette soiree sans celebrer ${person}, qui entre dans une retraite bien meritee sous les applaudissements.`
        : `Et il serait impossible de ne pas saluer ${person}, qui ouvre une nouvelle page avec une retraite amplement meritee.`
      : tone === "energetic"
        ? "Et bien sur, nous ne pouvions pas laisser passer cette soiree sans celebrer un depart a la retraite pleinement merite."
        : "Et il serait impossible de ne pas saluer un depart a la retraite pleinement merite.";

    if (scenarioType === "corporate") {
      details.personalLine = person
        ? `Le bon cote, pour ${person}, c'est que les reunions existent toujours, mais qu'elles deviennent enfin facultatives.`
        : "La bonne nouvelle, c'est que le prochain chapitre promet moins de reunions et beaucoup plus de liberte.";
    }
  } else if (lower.includes("promotion") || lower.includes("promoted")) {
    details.milestoneLine = person
      ? `Nous celebrons aussi ${person}, dont la promotion vient reconnaitre le travail, la confiance et une excellence constante.`
      : "Nous celebrons aussi une promotion qui vient reconnaitre le travail, la confiance et une excellence constante.";
  } else if (lower.includes("birthday")) {
    details.milestoneLine = person
      ? `Et ce soir, nous celebrons ${person}, dont la vie, le parcours et la presence donnent a chacun ici une belle raison de sourire.`
      : "Et ce soir, nous celebrons une personne dont la vie et le parcours donnent a chacun ici une belle raison de sourire.";
  } else if (lower.includes("farewell")) {
    details.milestoneLine = person
      ? `Nous prenons aussi le temps d'honorer ${person}, car un au revoir comme celui-ci rappelle qu'un passage marquant a vraiment compte.`
      : "Nous prenons aussi le temps d'honorer un au revoir qui rappelle qu'un passage marquant a vraiment compte.";
  }

  if (siblings) {
    details.personalLine = "On sent deja que c'est une occasion portee par la famille, l'histoire partagee et les personnes qui connaissent les souvenirs derriere les sourires de ce soir.";
  } else if (audience === "wedding") {
    details.personalLine = details.personalLine ?? "On sent deja l'amour dans cette salle, et cette atmosphere donne a chaque mot encore plus de valeur.";
  } else if (audience === "community") {
    details.personalLine = details.personalLine ?? "Il y a quelque chose de puissant dans une salle remplie de personnes presentes non par obligation, mais parce que ce moment compte vraiment pour elles.";
  }

  details.closeLine = scenarioType === "corporate"
    ? "Profitons donc de l'instant, honorons les personnes qui en sont au coeur et donnons le ton d'une tres belle soiree."
    : "Profitons pleinement de ce moment, honorons les personnes qui en sont le coeur et donnons vie a la salle des les premiers mots.";

  return details;
}

function buildEnglishScript({ scenarioTitle, tone, audience, length, template, additionalContext }: Omit<ScriptOptions, "language">) {
  const scenarioType = getScenarioType(scenarioTitle);
  const style = getEnglishToneStyle(tone);
  const audienceLine = getEnglishAudienceLine(audience);
  const context = parseContextValue(additionalContext);
  const normalizedLength = normalizeLength(length);
  const contextDetails = context ? buildEnglishContextDetails(context, scenarioType, audience, tone) : undefined;

  const openingMap = {
    wedding: `To ${audienceLine}, welcome.`,
    corporate: `To ${audienceLine}, welcome and thank you for being here.`,
    panel: `To ${audienceLine}, welcome to this conversation.`,
    personal: `To ${audienceLine}, thank you for sharing this moment with me.`,
    general: `To ${audienceLine}, welcome.`
  } as const;

  const lines = [
    template?.trim() || style.opener,
    openingMap[scenarioType],
    style.connector,
    style.energyLine
  ];

  if (contextDetails?.occasionLine) {
    lines.push(contextDetails.occasionLine);
  }

  if (normalizedLength !== "short") {
    lines.push(
      scenarioType === "corporate"
        ? "Tonight is not only about showing up, but about listening well, honoring the occasion, and moving forward with clarity."
        : "Moments like this remind us why presence, gratitude, and genuine connection still matter so deeply."
    );

    if (contextDetails?.milestoneLine) {
      lines.push(contextDetails.milestoneLine);
    }
  }

  if (normalizedLength === "long") {
    if (contextDetails?.personalLine) {
      lines.push(contextDetails.personalLine);
    }
    lines.push(
      tone === "energetic"
        ? "So let us bring our full hearts, our full attention, and our best energy into everything that follows tonight."
        : "Let us carry ourselves with grace, speak with intention, and make this a moment people will remember with joy."
    );
    lines.push(
      audience === "wedding"
        ? "May this celebration be filled with laughter, honor, and the kind of love that stays long after tonight is over."
        : audience === "corporate"
          ? "May this gathering leave us better connected, better aligned, and more inspired by what is possible together."
          : "May this occasion leave every person here feeling seen, included, and grateful to have shared it together."
    );
  }

  if (normalizedLength === "medium" && contextDetails?.personalLine) {
    lines.push(contextDetails.personalLine);
  }

  if (contextDetails?.closeLine) {
    lines.push(contextDetails.closeLine);
  }

  lines.push(
    normalizedLength === "short"
      ? "Thank you for being here. Let us begin."
      : normalizedLength === "medium"
        ? "Thank you for being here. Let us begin this moment with confidence, warmth, and purpose."
        : "Thank you for being here. Let us begin with confidence, generosity, and a spirit worthy of this occasion."
  );

  return lines.filter(Boolean).join("\n\n");
}

function buildFrenchScript({ scenarioTitle, tone, audience, length, template, additionalContext }: Omit<ScriptOptions, "language">) {
  const scenarioType = getScenarioType(scenarioTitle);
  const style = getFrenchToneStyle(tone);
  const audienceLine = getFrenchAudienceLine(audience);
  const context = parseContextValue(additionalContext);
  const normalizedLength = normalizeLength(length);
  const contextDetails = context ? buildFrenchContextDetails(context, scenarioType, audience, tone) : undefined;

  const openingMap = {
    wedding: `A ${audienceLine}, soyez les bienvenus.`,
    corporate: `A ${audienceLine}, bienvenue et merci d'etre presents.`,
    panel: `A ${audienceLine}, bienvenue dans cet echange.`,
    personal: `A ${audienceLine}, merci de partager ce moment avec moi.`,
    general: `A ${audienceLine}, bienvenue.`
  } as const;

  const lines = [
    template?.trim() || style.opener,
    openingMap[scenarioType],
    style.connector,
    style.energyLine
  ];

  if (contextDetails?.occasionLine) {
    lines.push(contextDetails.occasionLine);
  }

  if (normalizedLength !== "short") {
    lines.push(
      scenarioType === "corporate"
        ? "Ce soir, il ne s'agit pas seulement d'etre presents, mais aussi d'ecouter avec attention, d'honorer l'occasion et d'avancer avec clarte."
        : "Des moments comme celui-ci nous rappellent a quel point la presence, la gratitude et la vraie connexion restent essentielles."
    );

    if (contextDetails?.milestoneLine) {
      lines.push(contextDetails.milestoneLine);
    }
  }

  if (normalizedLength === "long") {
    if (contextDetails?.personalLine) {
      lines.push(contextDetails.personalLine);
    }
    lines.push(
      tone === "energetic"
        ? "Apportons donc tout notre coeur, toute notre attention et notre plus belle energie dans ce qui va suivre ce soir."
        : "Avancons avec grace, parlons avec intention et faisons de cet instant un souvenir heureux et durable."
    );
    lines.push(
      audience === "wedding"
        ? "Que cette celebration soit remplie de joie, d'honneur et d'un amour qui restera bien au-dela de cette soiree."
        : audience === "corporate"
          ? "Que cette rencontre nous laisse mieux connectes, mieux alignes et plus inspires par ce qu'il est possible de construire ensemble."
          : "Que cette occasion laisse a chacun le sentiment d'avoir ete vu, inclus et heureux d'avoir partage ce moment ensemble."
    );
  }

  if (normalizedLength === "medium" && contextDetails?.personalLine) {
    lines.push(contextDetails.personalLine);
  }

  if (contextDetails?.closeLine) {
    lines.push(contextDetails.closeLine);
  }

  lines.push(
    normalizedLength === "short"
      ? "Merci de votre presence. Commencons."
      : normalizedLength === "medium"
        ? "Merci d'etre ici. Entrons dans ce moment avec confiance, chaleur et intention."
        : "Merci d'etre ici. Commencons avec confiance, generosite et un esprit a la hauteur de cette occasion."
  );

  return lines.filter(Boolean).join("\n\n");
}

export function generateScript(options: ScriptOptions) {
  const supportedLanguage: SupportedLanguage = normalizeLanguage(options.language);

  return supportedLanguage === "FR"
    ? buildFrenchScript(options)
    : buildEnglishScript(options);
}
