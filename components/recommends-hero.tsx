import Image from "next/image";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
};

export function RecommendsHero({ eyebrow, title, subtitle, description }: Props) {
  return (
    <section className="relative overflow-hidden rounded-[1rem] border border-white/10 bg-[linear-gradient(135deg,rgba(234,179,8,0.08),rgba(40,40,40,0.18)_36%,rgba(14,14,14,0.96)_100%)] px-5 py-7 sm:px-7 sm:py-8 lg:px-9 lg:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_26%),radial-gradient(circle_at_72%_28%,rgba(234,179,8,0.12),transparent_24%)]" />

      <div className="absolute inset-y-0 right-0 hidden w-[42%] overflow-hidden md:block">
        <div className="absolute inset-y-0 right-0 w-full [mask-image:linear-gradient(to_left,black_62%,transparent_100%)]">
          <Image
            src="/ik-recommends.jpeg"
            alt="IK portrait"
            fill
            priority
            className="object-cover object-[58%_20%] opacity-70 brightness-[0.72] contrast-[1.08] saturate-[0.92]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(5,5,5,0.06),rgba(10,10,10,0.5),rgba(10,10,10,0.88)),radial-gradient(circle_at_35%_34%,rgba(234,179,8,0.16),transparent_34%),linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.7))]" />
          <div className="absolute inset-0 bg-black/18 mix-blend-multiply" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl space-y-5 md:pr-[30%] lg:pr-[34%] xl:pr-[38%]">
        <div className="space-y-3">
          <p className="section-eyebrow">{eyebrow}</p>
          <div className="h-px w-24 bg-gradient-to-r from-gold via-gold/35 to-transparent" />
          <h1 className="font-display text-4xl leading-none tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-200 sm:text-xl">{subtitle}</p>
        </div>

        <p className="max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">{description}</p>
      </div>
    </section>
  );
}
