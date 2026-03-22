import { redirect } from "next/navigation";
import {
  AuthorityBand,
  JourneySection,
  MarketingFinalCta,
  MarketingHero,
  NarrativeSection,
  ProofStrip
} from "@/components/marketing-hero";
import { PublicHeader } from "@/components/public-header";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { getPreferredLanguage } from "@/lib/locale";

const pageCopy = {
  EN: {
    heroEyebrow: "IK Talks Digital",
    heroTitle: "Speak with clarity. Command every room.",
    heroSubtitle: "Learn directly from IK. Practice real speaking scenarios. Get feedback that makes you better.",
    heroDescription:
      "For professionals, founders, MCs, leaders, and rising voices who want more than inspiration. This is where strong speaking becomes something you can actually train.",
    intentLabel: "Built for the moments that change how people remember you",
    intentIntro:
      "Whether you are preparing for a keynote, a panel, a wedding, a team presentation, or the next time a room suddenly expects you to lead, the platform is designed to make that moment feel less accidental.",
    intentItems: [
      { title: "Lead the room", note: "For speakers who want presence, control, and calm under pressure." },
      { title: "Host with polish", note: "For MCs and hosts who want warmth, timing, and authority." },
      { title: "Pitch with confidence", note: "For founders and professionals who need their message to land." },
      { title: "Grow your voice", note: "For people turning speaking into influence, opportunity, or income." }
    ],
    narrativeTitle: "Most people do not subscribe because they want more content. They subscribe because they want more command.",
    narrativeIntro:
      "The room changes careers. It changes trust. It changes how people remember you. IK Talks Digital exists for the people who know their voice matters, but do not want to keep improvising through the moments that count.",
    narrativeStory: [
      {
        title: "When the room finally turns to you",
        highlight: "Meetings. Stages. Introductions.",
        body:
          "You may already know your subject, your product, or your story. The problem is that knowing is not the same as delivering. Pressure exposes weak structure, shaky presence, and a voice that has never been coached."
      },
      {
        title: "When hosting demands more than energy",
        highlight: "Weddings. Corporate events. Panels.",
        body:
          "Being an MC is not just speaking loudly and smiling through transitions. It is timing, room control, warmth, authority, and the confidence to carry people from one moment to the next without losing them."
      },
      {
        title: "When talent needs repetition, not guesswork",
        highlight: "Practice between opportunities.",
        body:
          "Confidence grows faster when you can watch, rehearse, listen back, and improve with intention. That is what a subscription gives you: not one good moment, but a system for becoming better over time."
      }
    ],
    showcaseTitle: "A subscription that gives you more than lessons",
    showcaseDescription:
      "This page needed to feel more like entering a world, and that is what the product should promise too. A serious speaking subscription should give you teaching, rehearsal, perspective, and momentum in one place.",
    showcaseItems: [
      { title: "Premium teaching", note: "Learn from IK with a sense of rhythm, clarity, and taste that feels closer to a masterclass than a course marketplace." },
      { title: "Scenario rehearsal", note: "Practice the introductions, openings, transitions, and speaking moments you will actually face in real life." },
      { title: "Useful feedback", note: "Use your recordings to spot what is strengthening and what still needs work before the next real room arrives." },
      { title: "A sharper speaking identity", note: "Move from hoping you sound strong to knowing how you show up when the pressure is on." }
    ],
    proofTitle: "A premium speaking platform built for people who want to be remembered well.",
    proofItems: [
      {
        title: "Learn from IK",
        body: "Get direct teaching shaped by real stages, real audiences, and the kind of speaking moments that affect reputation, influence, and opportunity."
      },
      {
        title: "Practice before the pressure",
        body: "Rehearse guided scenarios that feel close to the moments you actually face, from introductions and hosting to professional speaking and room command."
      },
      {
        title: "Get coaching you can use quickly",
        body: "Instead of vague encouragement, you get feedback on confidence, clarity, and pace so every new attempt has a sharper focus."
      },
      {
        title: "Train with African context in mind",
        body: "The tone, examples, and speaking situations are grounded in the audiences, events, and ambitions modern African speakers actually navigate."
      }
    ],
    journeyTitle: "How it works",
    journeySteps: [
      {
        title: "Watch",
        body: "Start with premium lessons from IK so you understand the thinking behind strong delivery, room control, storytelling, and presence."
      },
      {
        title: "Practice",
        body: "Step into guided speaking scenarios and record yourself in moments that mirror real work, real events, and real stages."
      },
      {
        title: "Improve",
        body: "Use the feedback loop to notice patterns, strengthen weak spots, and keep building the voice people trust and remember."
      }
    ],
    learningTitle: "What you will grow inside the platform",
    learningAreas: [
      {
        title: "Confidence & Presence",
        note: "Show up like you belong there, even when the room is big, unfamiliar, or important."
      },
      {
        title: "Hosting & MC Skills",
        note: "Guide ceremonies, panels, and live moments with warmth, timing, and control."
      },
      {
        title: "Public Speaking",
        note: "Move from nervous delivery to a structured message that lands with force."
      },
      {
        title: "Storytelling",
        note: "Make people follow your point, feel your message, and remember your voice after you sit down."
      },
      {
        title: "Voice & Delivery",
        note: "Sharpen pace, energy, pause, and vocal command so your message feels deliberate."
      },
      {
        title: "Speaking as a Business",
        note: "Grow the presence, polish, and positioning that make your voice part of your professional value."
      }
    ],
    authorityTitle: "Built from the real-world perspective of one of Africa's most respected hosts.",
    authorityBody:
      "IK Talks Digital is not built from generic speaking theory alone. It is shaped by the lived realities of commanding rooms, hosting events, carrying audiences, and turning voice into influence.",
    authorityQuote: "\"Learn from IK. Then step into the room more ready than you were yesterday.\"",
    finalTitle: "Your voice can take you further.",
    finalBody: "Subscribe for the lessons, the rehearsal, and the feedback loop that helps your speaking stop feeling accidental and start feeling intentional."
  },
  FR: {
    heroEyebrow: "IK Talks Digital",
    heroTitle: "Parlez avec clarte. Tenez chaque salle.",
    heroSubtitle: "Apprenez directement avec IK. Pratiquez de vrais scenarios. Recevez un retour qui vous fait progresser.",
    heroDescription:
      "Pour les professionnels, fondateurs, MC, leaders et voix en devenir qui veulent plus que de l'inspiration. C'est l'endroit ou la parole devient une competence que l'on peut vraiment entrainer.",
    intentLabel: "Pense pour les moments qui changent la facon dont on se souvient de vous",
    intentIntro:
      "Que vous prepariez une keynote, un panel, un mariage, une presentation d'equipe ou le prochain moment ou une salle s'attend soudain a ce que vous preniez la parole, la plateforme est concue pour que cet instant paraisse moins accidentel.",
    intentItems: [
      { title: "Maitrisez la salle", note: "Pour les orateurs qui veulent plus de presence, de controle et de calme sous pression." },
      { title: "Animez avec elegance", note: "Pour les MC et les hosts qui veulent chaleur, timing et autorite." },
      { title: "Pitchez avec confiance", note: "Pour les fondateurs et professionnels qui ont besoin que leur message touche juste." },
      { title: "Faites grandir votre voix", note: "Pour ceux qui transforment la parole en influence, opportunite ou revenu." }
    ],
    narrativeTitle: "La plupart des gens ne s'abonnent pas parce qu'ils veulent plus de contenu. Ils s'abonnent parce qu'ils veulent plus d'impact.",
    narrativeIntro:
      "La salle change des carrieres. Elle change la confiance. Elle change la facon dont on se souvient de vous. IK Talks Digital existe pour ceux qui savent que leur voix compte, mais qui ne veulent plus improviser les moments decisifs.",
    narrativeStory: [
      {
        title: "Quand la salle se tourne enfin vers vous",
        highlight: "Reunions. Scenes. Presentations.",
        body:
          "Vous connaissez peut-etre deja votre sujet, votre produit ou votre histoire. Le probleme, c'est que savoir n'est pas la meme chose que bien livrer. La pression revele vite une structure faible, une presence fragile et une voix jamais coachee."
      },
      {
        title: "Quand animer demande plus que de l'energie",
        highlight: "Mariages. Evenements. Panels.",
        body:
          "Etre MC, ce n'est pas seulement parler fort et sourire entre deux transitions. C'est le timing, la maitrise de la salle, la chaleur, l'autorite et la confiance de faire avancer le moment sans perdre le public."
      },
      {
        title: "Quand le talent a besoin de repetition, pas d'improvisation",
        highlight: "Pratique entre les opportunites.",
        body:
          "La confiance grandit plus vite quand on peut regarder, repeter, se revoir et progresser avec intention. C'est ce qu'un abonnement offre: pas seulement un bon moment, mais un systeme pour devenir meilleur dans le temps."
      }
    ],
    showcaseTitle: "Un abonnement qui apporte plus que des lecons",
    showcaseDescription:
      "Cette page devait ressembler davantage a l'entree dans un univers, et c'est aussi la promesse du produit. Un abonnement serieux pour la parole doit reunir l'enseignement, la repetition, la perspective et l'elan au meme endroit.",
    showcaseItems: [
      { title: "Enseignement premium", note: "Apprenez avec IK dans un rythme, une clarte et une exigence qui rappellent davantage une masterclass qu'un simple catalogue." },
      { title: "Repetition par scenario", note: "Pratiquez les introductions, ouvertures, transitions et prises de parole que vous allez vraiment vivre." },
      { title: "Retour utile", note: "Utilisez vos enregistrements pour voir ce qui se renforce et ce qui demande encore du travail avant la prochaine vraie salle." },
      { title: "Une identite vocale plus forte", note: "Passez de l'espoir de bien sonner a la certitude de savoir comment vous vous presentez sous pression." }
    ],
    proofTitle: "Une plateforme premium pour les orateurs qui veulent laisser une vraie empreinte.",
    proofItems: [
      {
        title: "Apprenez avec IK",
        body: "Profitez d'un enseignement direct modele par de vraies scenes, de vrais publics et les prises de parole qui influencent reputation, confiance et opportunites."
      },
      {
        title: "Pratiquez avant la pression",
        body: "Repetez des scenarios guides proches des moments que vous vivez reellement: introductions, animation, prises de parole et maitrise de la salle."
      },
      {
        title: "Recevez un coaching utile tout de suite",
        body: "Au lieu d'encouragements vagues, vous obtenez un retour sur la confiance, la clarte et le rythme pour donner un objectif net a chaque nouvelle tentative."
      },
      {
        title: "Pense pour le contexte africain",
        body: "Le ton, les exemples et les situations de parole sont ancrs dans les publics, les evenements et les ambitions des orateurs africains d'aujourd'hui."
      }
    ],
    journeyTitle: "Comment ca marche",
    journeySteps: [
      {
        title: "Regarder",
        body: "Commencez par les lecons premium d'IK pour comprendre la logique d'une bonne delivery, de la maitrise de la salle, du storytelling et de la presence."
      },
      {
        title: "Pratiquer",
        body: "Entrez dans des scenarios guides et enregistrez-vous dans des moments qui ressemblent au travail reel, aux evenements reels et aux vraies scenes."
      },
      {
        title: "Progresser",
        body: "Utilisez la boucle de retour pour remarquer vos habitudes, renforcer vos points faibles et construire une voix que l'on respecte et dont on se souvient."
      }
    ],
    learningTitle: "Ce que vous allez developper dans la plateforme",
    learningAreas: [
      {
        title: "Confiance et presence",
        note: "Arrivez avec la sensation d'etre a votre place, meme quand la salle est grande, nouvelle ou importante."
      },
      {
        title: "Animation et MC",
        note: "Conduisez ceremonies, panels et moments en direct avec chaleur, timing et maitrise."
      },
      {
        title: "Prise de parole",
        note: "Passez d'une delivery nerveuse a un message structure qui touche avec force."
      },
      {
        title: "Storytelling",
        note: "Faites suivre votre idee, ressentir votre message et retenir votre voix apres votre intervention."
      },
      {
        title: "Voix et delivery",
        note: "Affinez rythme, energie, pause et maitrise vocale pour que votre message paraisse intentionnel."
      },
      {
        title: "La parole comme activite",
        note: "Developpez la presence, le polish et le positionnement qui font de votre voix une vraie valeur professionnelle."
      }
    ],
    authorityTitle: "Construit a partir de la perspective reelle de l'un des presentateurs les plus respectes d'Afrique.",
    authorityBody:
      "IK Talks Digital n'est pas construit uniquement a partir d'une theorie generique. La plateforme est faconnee par la realite de la maitrise des salles, de l'animation d'evenements, du rapport au public et du pouvoir d'une voix qui influence.",
    authorityQuote: "\"Apprenez avec IK. Puis entrez dans la salle plus pret qu'hier.\"",
    finalTitle: "Votre voix peut vous emmener plus loin.",
    finalBody: "Abonnez-vous pour les lecons, la repetition et la boucle de retour qui permettent a votre parole d'arreter d'etre accidentelle et de devenir intentionnelle."
  }
} as const;

export default async function LearnMorePage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/dashboard");
  }

  const language = await getPreferredLanguage();
  const dict = getDictionary(language);
  const copy = pageCopy[language];

  return (
    <div className="min-h-screen bg-aura text-white">
      <div className="border-b border-white/10 bg-black/85 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <PublicHeader language={language} dict={dict} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 sm:py-8 lg:space-y-14 lg:px-8 lg:py-10">
        <MarketingHero eyebrow={copy.intentLabel} description={copy.intentIntro} items={copy.intentItems} />

        <NarrativeSection title={copy.narrativeTitle} intro={copy.narrativeIntro} story={copy.narrativeStory} />

        <ProofStrip title={copy.proofTitle} items={copy.proofItems} />

        <JourneySection title={copy.journeyTitle} steps={copy.journeySteps} />

        <AuthorityBand title={copy.authorityTitle} body={copy.authorityBody} quote={copy.authorityQuote} />

        <MarketingFinalCta
          title={copy.finalTitle}
          body={copy.finalBody}
          primaryLabel={dict.startJourney}
          secondaryLabel={dict.login}
        />
      </div>
    </div>
  );
}
