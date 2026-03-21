import Image from "next/image";
import Link from "next/link";
import { Dictionary } from "@/lib/i18n";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(234,179,8,0.15),rgba(255,255,255,0.03))] p-8 shadow-glow md:p-10">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_55%)]" />
      <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.45em] text-gold">{dict.premiumSpeakingAcademy}</p>
          <h1 className="max-w-2xl font-display text-5xl leading-tight text-white md:text-7xl">
            {dict.cinematicConfidence}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">{dict.homeIntro}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/signup" className="rounded-full bg-gold px-6 py-3 font-medium text-black transition hover:opacity-90">
              {dict.startJourney}
            </Link>
            <Link href="/login" className="rounded-full border border-white/20 px-6 py-3 font-medium text-white transition hover:border-gold/60 hover:text-gold">
              {dict.login}
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute bottom-8 right-1/2 h-44 w-44 translate-x-1/2 rounded-full bg-gold/20 blur-3xl lg:right-16 lg:translate-x-0" />
          <div className="relative h-[420px] w-full max-w-[430px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)]">
            <Image
              src="/ak-hero.png.png"
              alt="AK smiling in a black formal suit"
              fill
              priority
              className="object-contain object-bottom drop-shadow-[0_30px_70px_rgba(0,0,0,0.55)]"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0a]/75 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
