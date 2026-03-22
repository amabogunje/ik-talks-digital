import Image from "next/image";
import Link from "next/link";

type StageVisualProps = {
  portraitSrc?: string;
};

function StageVisual({ portraitSrc = "/speaker-1.jpg" }: StageVisualProps) {
  return (
    <div className="relative h-[24rem] overflow-hidden lg:h-[31rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(234,179,8,0.16),transparent_26%),radial-gradient(circle_at_76%_20%,rgba(255,255,255,0.08),transparent_16%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_38%)]" />
      <svg viewBox="0 0 800 800" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="stageGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(250,204,21,0.14)" />
            <stop offset="100%" stopColor="rgba(250,204,21,0)" />
          </linearGradient>
          <linearGradient id="crowdFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="800" height="800" fill="url(#stageGlow)" opacity="0.72" />
        <ellipse cx="520" cy="220" rx="230" ry="110" fill="rgba(250,204,21,0.11)" />
        <path d="M0 560 C180 480 360 480 800 570 L800 800 L0 800 Z" fill="rgba(5,5,5,0.95)" />
        <path d="M0 620 C210 540 430 550 800 630 L800 800 L0 800 Z" fill="rgba(0,0,0,0.92)" />
        <g opacity="0.5" fill="url(#crowdFade)">
          <circle cx="90" cy="620" r="34" />
          <circle cx="150" cy="598" r="42" />
          <circle cx="220" cy="626" r="36" />
          <circle cx="292" cy="602" r="44" />
          <circle cx="364" cy="628" r="34" />
          <circle cx="435" cy="608" r="40" />
          <circle cx="506" cy="632" r="32" />
          <circle cx="576" cy="605" r="42" />
          <circle cx="645" cy="628" r="36" />
        </g>
      </svg>
      <div className="absolute inset-y-0 right-0 w-[48%] min-w-[18rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_24%,rgba(250,204,21,0.2),transparent_28%)]" />
        <div className="absolute inset-y-0 left-0 w-[62%] bg-[linear-gradient(to_right,rgba(10,10,10,1),rgba(10,10,10,0.72),rgba(10,10,10,0.06))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.88),rgba(0,0,0,0.22)_40%,rgba(0,0,0,0.48))]" />
        <div className="absolute inset-y-0 right-0 w-full [mask-image:linear-gradient(to_left,black_70%,transparent_100%),linear-gradient(to_bottom,transparent_0%,black_18%,black_90%,transparent_100%)] [mask-composite:intersect]">
          <Image src={portraitSrc} alt="Speaker on stage" fill className="object-cover object-center opacity-78 saturate-[0.94] drop-shadow-[0_28px_80px_rgba(0,0,0,0.45)]" priority />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,rgba(5,5,5,0.96),transparent)]" />
      <div className="absolute left-0 top-0 flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-white/55">
        <span className="inline-block h-2 w-2 rounded-full bg-gold shadow-[0_0_18px_rgba(234,179,8,0.65)]" />
        <span>From quiet potential to room command</span>
      </div>
    </div>
  );
}

type HeroIntentItem = {
  title: string;
  note: string;
};

type HeroProps = {
  eyebrow: string;
  description: string;
  items: readonly HeroIntentItem[];
};

export function MarketingHero({ eyebrow, description, items }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/8 pb-12 lg:pb-16">
      <div className="w-full pb-6 lg:pb-8">
        <p className="mb-5 max-w-6xl font-display text-2xl leading-tight tracking-[-0.03em] text-gold sm:text-3xl lg:mb-7 lg:text-[2.7rem]">{eyebrow}</p>
        <p className="max-w-6xl text-lg leading-8 text-white/88 sm:text-xl lg:text-[1.35rem] lg:leading-9">{description}</p>
        <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <article key={item.title}>
              <div className="h-px w-16 bg-gold/60" />
              <h3 className="mt-4 text-sm uppercase tracking-[0.2em] text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{item.note}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="relative min-h-[24rem] overflow-hidden sm:min-h-[30rem] lg:min-h-[38rem]">
        <Image src="/speaker-1.jpg" alt="Speaker addressing a crowd" fill priority className="object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.12)_62%,rgba(0,0,0,0.22))]" />
      </div>
    </section>
  );
}

type IntentPill = {
  title: string;
  note: string;
};

type IntentStripProps = {
  label: string;
  intro: string;
  items: readonly IntentPill[];
};

export function IntentStrip({ label, intro }: IntentStripProps) {
  return (
    <section className="border-b border-white/8 pb-10 lg:pb-12">
      <div className="max-w-4xl">
        <p className="section-eyebrow text-gold/80">For who this is built</p>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500">{label}</p>
        <p className="mt-3 max-w-3xl text-base leading-8 text-zinc-300 sm:text-lg">{intro}</p>
      </div>
    </section>
  );
}

type ShowcaseItem = {
  title: string;
  note: string;
};

type EditorialShowcaseProps = {
  title: string;
  description: string;
  items: readonly ShowcaseItem[];
};

export function EditorialShowcase({ title, description, items }: EditorialShowcaseProps) {
  return (
    <section className="border-b border-white/8 pb-10 lg:pb-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-10">
        <div>
          <p className="section-eyebrow">Inside the subscription</p>
          <h2 className="mt-4 section-title text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-5 max-w-lg text-base leading-8 text-zinc-300 sm:text-lg">{description}</p>
        </div>
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {items.map((item) => (
            <article key={item.title}>
              <div className="mb-5 h-28 overflow-hidden bg-[linear-gradient(135deg,rgba(250,204,21,0.08),rgba(255,255,255,0.02))]">
                <svg viewBox="0 0 320 120" className="h-full w-full" aria-hidden="true">
                  <rect x="0" y="0" width="320" height="120" fill="transparent" />
                  <circle cx="62" cy="48" r="18" fill="rgba(255,255,255,0.5)" />
                  <path d="M38 90 C54 66 72 64 88 90" fill="rgba(255,255,255,0.22)" />
                  <circle cx="136" cy="42" r="12" fill="rgba(255,255,255,0.35)" />
                  <path d="M124 74 C132 60 142 60 150 74" fill="rgba(255,255,255,0.18)" />
                  <path d="M196 34 h80 v48 h-80 z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.14)" />
                  <path d="M206 50 h46" stroke="rgba(250,204,21,0.65)" strokeWidth="3" />
                  <path d="M206 62 h34" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
                  <path d="M206 74 h52" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                </svg>
              </div>
              <h3 className="font-display text-2xl tracking-[-0.03em] text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{item.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

type StoryRow = {
  title: string;
  body: string;
  highlight: string;
};

function StoryCard({ index, item }: { index: number; item: StoryRow }) {
  return (
    <article>
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold/80">0{index + 1}</p>
      <h3 className="mt-3 font-display text-2xl tracking-[-0.03em] text-white">{item.title}</h3>
      <p className="mt-3 text-sm uppercase tracking-[0.22em] text-zinc-500">{item.highlight}</p>
      <p className="mt-4 text-base leading-7 text-zinc-300">{item.body}</p>
    </article>
  );
}

type NarrativeSectionProps = {
  title: string;
  intro: string;
  story: readonly StoryRow[];
};

export function NarrativeSection({ title, intro, story }: NarrativeSectionProps) {
  return (
    <section className="border-b border-white/8 pb-10 lg:pb-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="section-eyebrow">Why people subscribe</p>
          <h2 className="mt-4 section-title max-w-xl text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-5 max-w-lg text-base leading-8 text-zinc-300 sm:text-lg">{intro}</p>
        </div>
        <div className="grid gap-10">
          {story.map((item, index) => (
            <StoryCard key={item.title} index={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

type ProofItem = {
  title: string;
  body: string;
};

type ProofStripProps = {
  title: string;
  items: readonly ProofItem[];
};

export function ProofStrip({ title, items }: ProofStripProps) {
  return (
    <section className="border-b border-white/8 pb-10 lg:pb-14">
      <div className="max-w-xl">
        <p className="section-eyebrow">Why IK Talks Digital feels different</p>
        <h2 className="mt-4 section-title text-3xl sm:text-4xl">{title}</h2>
      </div>
      <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item.title}>
            <div className="mb-4 h-px w-14 bg-gold/70" />
            <h3 className="font-display text-xl tracking-[-0.03em] text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-300">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

type JourneyStep = {
  title: string;
  body: string;
};

type JourneySectionProps = {
  title: string;
  steps: readonly JourneyStep[];
};

function JourneyIllustration({ kind }: { kind: "watch" | "practice" | "improve" }) {
  if (kind === "watch") {
    return (
      <div className="mb-5 h-24 w-28 overflow-hidden bg-[linear-gradient(135deg,rgba(250,204,21,0.1),rgba(255,255,255,0.03))]">
        <svg viewBox="0 0 160 110" className="h-full w-full" aria-hidden="true">
          <rect x="20" y="18" width="120" height="72" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" />
          <circle cx="64" cy="51" r="12" fill="rgba(255,255,255,0.4)" />
          <path d="M52 76 C60 58 70 56 78 76" fill="rgba(255,255,255,0.18)" />
          <path d="M96 40 h24" stroke="rgba(250,204,21,0.75)" strokeWidth="4" strokeLinecap="round" />
          <path d="M96 52 h18" stroke="rgba(255,255,255,0.36)" strokeWidth="4" strokeLinecap="round" />
          <path d="M32 96 h96" stroke="rgba(255,255,255,0.15)" strokeWidth="4" strokeLinecap="round" />
          <polygon points="128,48 128,60 138,54" fill="rgba(250,204,21,0.85)" />
        </svg>
      </div>
    );
  }

  if (kind === "practice") {
    return (
      <div className="mb-5 h-24 w-28 overflow-hidden bg-[linear-gradient(135deg,rgba(250,204,21,0.1),rgba(255,255,255,0.03))]">
        <svg viewBox="0 0 160 110" className="h-full w-full" aria-hidden="true">
          <rect x="30" y="20" width="44" height="62" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.16)" />
          <circle cx="52" cy="42" r="9" fill="rgba(255,255,255,0.4)" />
          <path d="M40 66 C46 53 58 53 64 66" fill="rgba(255,255,255,0.2)" />
          <rect x="94" y="34" width="14" height="28" rx="7" fill="rgba(250,204,21,0.82)" />
          <path d="M90 48 C84 42 84 32 90 26" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M112 48 C118 42 118 32 112 26" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M101 62 v12" stroke="rgba(250,204,21,0.82)" strokeWidth="3" strokeLinecap="round" />
          <path d="M93 75 h16" stroke="rgba(250,204,21,0.82)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className="mb-5 h-24 w-28 overflow-hidden bg-[linear-gradient(135deg,rgba(250,204,21,0.1),rgba(255,255,255,0.03))]">
      <svg viewBox="0 0 160 110" className="h-full w-full" aria-hidden="true">
        <path d="M24 82 h112" stroke="rgba(255,255,255,0.16)" strokeWidth="4" strokeLinecap="round" />
        <path d="M36 68 L62 54 L84 60 L122 30" stroke="rgba(250,204,21,0.82)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="36" cy="68" r="4" fill="rgba(255,255,255,0.55)" />
        <circle cx="62" cy="54" r="4" fill="rgba(255,255,255,0.55)" />
        <circle cx="84" cy="60" r="4" fill="rgba(255,255,255,0.55)" />
        <circle cx="122" cy="30" r="4" fill="rgba(250,204,21,0.9)" />
        <rect x="28" y="24" width="32" height="16" rx="8" fill="rgba(255,255,255,0.08)" />
        <path d="M36 32 h16" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function JourneySection({ title, steps }: JourneySectionProps) {
  const illustrationKinds: Array<"watch" | "practice" | "improve"> = ["watch", "practice", "improve"];

  return (
    <section className="border-b border-white/8 pb-10 lg:pb-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-10">
        <div>
          <p className="section-eyebrow">How the platform works</p>
          <h2 className="mt-4 section-title text-3xl sm:text-4xl">{title}</h2>
        </div>
        <div className="grid gap-x-8 gap-y-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title}>
              <JourneyIllustration kind={illustrationKinds[index] ?? "improve"} />
              <h3 className="mt-1 font-display text-2xl tracking-[-0.03em] text-white">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-300">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

type LearningArea = {
  title: string;
  note: string;
};

type LearningMosaicProps = {
  title: string;
  areas: readonly LearningArea[];
};

export function LearningMosaic({ title, areas }: LearningMosaicProps) {
  return (
    <section className="border-b border-white/8 pb-10 lg:pb-14">
      <div className="max-w-2xl">
        <p className="section-eyebrow">What you will build</p>
        <h2 className="mt-4 section-title text-3xl sm:text-4xl">{title}</h2>
      </div>
      <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        {areas.map((area) => (
          <article key={area.title}>
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Skill track</p>
            <h3 className="mt-4 font-display text-2xl tracking-[-0.03em] text-white">{area.title}</h3>
            <p className="mt-4 text-sm leading-7 text-zinc-300">{area.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

type AuthorityBandProps = {
  title: string;
  body: string;
  quote: string;
};

export function AuthorityBand({ title, body, quote }: AuthorityBandProps) {
  return (
    <section className="border-b border-white/8 pb-10 lg:pb-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_18rem] lg:items-center lg:gap-10">
        <div>
          <p className="section-eyebrow">Learn with IK</p>
          <h2 className="mt-4 section-title text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">{body}</p>
          <blockquote className="mt-6 max-w-2xl border-l border-gold/60 pl-4 font-display text-xl leading-8 text-white/92 sm:text-2xl">
            {quote}
          </blockquote>
        </div>
        <div className="relative hidden h-[22rem] overflow-hidden lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_22%,rgba(250,204,21,0.24),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(255,255,255,0.08),transparent_14%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(0,0,0,0.08),rgba(0,0,0,0.7)),linear-gradient(to_top,rgba(0,0,0,0.86),rgba(0,0,0,0.2)_42%,rgba(0,0,0,0.42))]" />
          <div className="absolute inset-y-0 left-0 w-28 bg-[linear-gradient(to_right,rgba(11,11,11,1),rgba(11,11,11,0))]" />
          <div className="absolute inset-0 [mask-image:linear-gradient(to_left,black_74%,transparent_100%),linear-gradient(to_bottom,transparent_0%,black_12%,black_88%,transparent_100%)] [mask-composite:intersect]">
            <Image src="/Ik-Osakioduwa.jpg" alt="IK portrait" fill className="object-cover object-[58%_18%] opacity-[0.88] saturate-[0.98] contrast-[1.04] brightness-[0.94]" />
          </div>
        </div>
      </div>
    </section>
  );
}

type FinalCtaProps = {
  title: string;
  body: string;
  primaryLabel: string;
  secondaryLabel: string;
};

export function MarketingFinalCta({ title, body, primaryLabel, secondaryLabel }: FinalCtaProps) {
  return (
    <section className="pt-2">
      <div className="max-w-3xl">
        <p className="section-eyebrow">Ready when you are</p>
        <h2 className="mt-4 font-display text-3xl leading-[1] tracking-[-0.04em] text-white sm:text-4xl lg:text-[3.45rem]">{title}</h2>
        <p className="mt-5 text-base leading-8 text-zinc-200 sm:text-lg">{body}</p>
        <div className="mt-8">
          <Link href="/signup" className="button-primary min-w-[11rem]">{primaryLabel}</Link>
        </div>
      </div>
    </section>
  );
}

