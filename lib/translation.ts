import { createHash } from "crypto";
import { Language } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeLanguage } from "@/lib/locale";

const staticTranslations: Record<string, { FR: string }> = {
  "Command the Room": { FR: "Commander la salle" },
  "Build stage confidence, vocal control, and the presence to hold any room.": {
    FR: "Developpez votre confiance sur scene, votre controle vocal et la presence necessaire pour tenir n'importe quelle salle."
  },
  "Host With Grace": { FR: "Animer avec elegance" },
  "Learn MC structure, transitions, and crowd-reading for live events.": {
    FR: "Apprenez la structure d'un maitre de ceremonie, les transitions et la lecture du public pour les evenements en direct."
  },
  "Speak to Inspire": { FR: "Parler pour inspirer" },
  "Shape memorable stories, persuasive messages, and audience connection for talks that move people.": {
    FR: "Construisez des histoires memorables, des messages persuasifs et une vraie connexion avec le public pour des prises de parole qui touchent les gens."
  }
};

const translationRequestCache = new Map<string, Promise<string>>();

type TranslationEntity = {
  entityType: string;
  entityId: string;
  fieldName: string;
};

function getStaticTranslation(text: string, language: Language) {
  const supportedLanguage = normalizeLanguage(language);
  if (supportedLanguage === "EN") return text;
  return staticTranslations[text]?.FR ?? text;
}

function getSourceHash(text: string) {
  return createHash("sha256").update(text).digest("hex");
}

async function saveTranslation(entity: TranslationEntity, language: Language, sourceHash: string, translatedText: string, provider: string) {
  await prisma.contentTranslation.upsert({
    where: {
      entityType_entityId_fieldName_language: {
        entityType: entity.entityType,
        entityId: entity.entityId,
        fieldName: entity.fieldName,
        language
      }
    },
    create: {
      ...entity,
      language,
      sourceHash,
      translatedText,
      provider
    },
    update: {
      sourceHash,
      translatedText,
      provider
    }
  });
}

async function translateWithOpenAI(text: string, language: Language) {
  const supportedLanguage = normalizeLanguage(language);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || supportedLanguage === "EN") return getStaticTranslation(text, supportedLanguage);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TRANSLATION_MODEL || "gpt-4.1-mini",
      input: `Translate the following product copy into French. Keep it natural, concise, and culturally appropriate for African users. Return only the translation.\n\n${text}`
    }),
    cache: "no-store"
  });

  if (!response.ok) return getStaticTranslation(text, supportedLanguage);
  const data = (await response.json()) as { output_text?: string };
  return data.output_text?.trim() || getStaticTranslation(text, supportedLanguage);
}

export async function translateDynamicText(text: string, language: Language, entity: TranslationEntity) {
  const supportedLanguage = normalizeLanguage(language);
  if (!text || supportedLanguage === "EN") return text;

  const sourceHash = getSourceHash(text);
  const staticTranslation = getStaticTranslation(text, supportedLanguage);
  if (staticTranslation !== text) {
    await saveTranslation(entity, Language.FR, sourceHash, staticTranslation, "static");
    return staticTranslation;
  }

  const existing = await prisma.contentTranslation.findUnique({
    where: {
      entityType_entityId_fieldName_language: {
        entityType: entity.entityType,
        entityId: entity.entityId,
        fieldName: entity.fieldName,
        language: Language.FR
      }
    }
  });

  if (existing?.sourceHash === sourceHash) {
    return existing.translatedText;
  }

  const cacheKey = `${entity.entityType}:${entity.entityId}:${entity.fieldName}:FR:${sourceHash}`;
  if (!translationRequestCache.has(cacheKey)) {
    translationRequestCache.set(
      cacheKey,
      (async () => {
        const translatedText = await translateWithOpenAI(text, Language.FR);
        const provider = process.env.OPENAI_API_KEY ? "openai" : "fallback";
        await saveTranslation(entity, Language.FR, sourceHash, translatedText, provider);
        return translatedText;
      })()
    );
  }

  return translationRequestCache.get(cacheKey) as Promise<string>;
}

export async function translateCourseText<T extends { id: string; title: string; description: string }>(items: T[], language: Language) {
  return Promise.all(
    items.map(async (item) => ({
      ...item,
      title: await translateDynamicText(item.title, language, { entityType: "course", entityId: item.id, fieldName: "title" }),
      description: await translateDynamicText(item.description, language, { entityType: "course", entityId: item.id, fieldName: "description" })
    }))
  );
}

export async function translateLessonsText<T extends { id: string; title: string; description: string }>(items: T[], language: Language) {
  return Promise.all(
    items.map(async (item) => ({
      ...item,
      title: await translateDynamicText(item.title, language, { entityType: "lesson", entityId: item.id, fieldName: "title" }),
      description: await translateDynamicText(item.description, language, { entityType: "lesson", entityId: item.id, fieldName: "description" })
    }))
  );
}

export async function translateScenarioText<T extends { id: string; title: string; description: string; guidance?: string }>(items: T[], language: Language) {
  return Promise.all(
    items.map(async (item) => ({
      ...item,
      title: await translateDynamicText(item.title, language, { entityType: "scenario", entityId: item.id, fieldName: "title" }),
      description: await translateDynamicText(item.description, language, { entityType: "scenario", entityId: item.id, fieldName: "description" }),
      guidance: item.guidance
        ? await translateDynamicText(item.guidance, language, { entityType: "scenario", entityId: item.id, fieldName: "guidance" })
        : item.guidance
    }))
  );
}
