import Image from "next/image";
import Link from "next/link";
import { Dictionary } from "@/lib/i18n";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden rounded-[0.9rem] border border-white/10 bg-[linear-gradient(135deg,rgba(234,179,8,0.16),rgba(62,62,62,0.28)_45%,rgba(18,18,18,0.9)_100%)] px-6 py-8 shadow-glow sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-12 lg:py-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_80%_25%,rgba(234,179,8,0.14),transparent_26%)]" />
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.09),transparent_58%)] lg:block" />
      <div className="relative grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
        <div className="max-w-3xl">
          <p className="section-eyebrow mb-4">{dict.premiumSpeakingAcademy}</p>
          <h1 className="text-balance-pretty max-w-2xl font-display text-4xl leading-[0.99] tracking-[-0.035em] text-white sm:text-5xl md:text-6xl lg:text-[4.75rem]">
            {dict.cinematicConfidence}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">{dict.homeIntro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link href="/signup" className="inline-flex min-w-[11rem] items-center justify-center rounded-[0.45rem] bg-gold px-6 py-3 font-medium text-black transition hover:opacity-90">
              {dict.startJourney}
            </Link>
            <Link href="/login" className="inline-flex min-w-[10rem] items-center justify-center rounded-[0.45rem] border border-white/20 px-6 py-3 font-medium text-white transition hover:border-gold/60 hover:text-gold">
              {dict.login}
            </Link>
            <Link href="/learn-more" className="inline-flex min-w-[10rem] items-center justify-center rounded-[0.45rem] border border-white/10 bg-white/5 px-6 py-3 font-medium text-zinc-100 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white">
              {dict.learnMore}
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute bottom-8 right-1/2 h-36 w-36 translate-x-1/2 rounded-full bg-gold/20 blur-3xl sm:h-44 sm:w-44 lg:right-12 lg:translate-x-0" />
          <div className="absolute inset-y-10 right-4 hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block" />
          <div className="relative h-[320px] w-full max-w-[340px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_84%,transparent_100%)] sm:h-[390px] sm:max-w-[380px] md:h-[450px] md:max-w-[440px]">
            <Image
              src="/ak-hero.png.png"
              alt="AK smiling in a black formal suit"
              fill
              priority
              className="object-contain object-bottom drop-shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#111111]/85 to-transparent sm:h-28" />
          </div>
        </div>
      </div>
    </section>
  );
}
