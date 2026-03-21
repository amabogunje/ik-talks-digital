import Image from "next/image";
import Link from "next/link";
import { Dictionary } from "@/lib/i18n";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(234,179,8,0.15),rgba(255,255,255,0.03))] p-5 shadow-glow sm:p-8 md:p-10">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_55%)] lg:block" />
      <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs uppercase tracking-[0.38em] text-gold sm:mb-4 sm:text-sm sm:tracking-[0.45em]">{dict.premiumSpeakingAcademy}</p>
          <h1 className="max-w-2xl font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {dict.cinematicConfidence}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:mt-6 sm:text-lg sm:leading-8">{dict.homeIntro}</p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link href="/signup" className="inline-flex justify-center rounded-full bg-gold px-6 py-3 font-medium text-black transition hover:opacity-90">
              {dict.startJourney}
            </Link>
            <Link href="/login" className="inline-flex justify-center rounded-full border border-white/20 px-6 py-3 font-medium text-white transition hover:border-gold/60 hover:text-gold">
              {dict.login}
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute bottom-6 right-1/2 h-32 w-32 translate-x-1/2 rounded-full bg-gold/20 blur-3xl sm:h-40 sm:w-40 lg:right-16 lg:translate-x-0" />
          <div className="relative h-[300px] w-full max-w-[320px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_84%,transparent_100%)] sm:h-[360px] sm:max-w-[360px] md:h-[420px] md:max-w-[430px]">
            <Image
              src="/ak-hero.png.png"
              alt="AK smiling in a black formal suit"
              fill
              priority
              className="object-contain object-bottom drop-shadow-[0_30px_70px_rgba(0,0,0,0.55)]"
            />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a0a0a]/75 to-transparent sm:h-24" />
          </div>
        </div>
      </div>
    </section>
  );
}
