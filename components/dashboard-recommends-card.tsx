import Image from "next/image";
import Link from "next/link";

type Props = {
  eyebrow: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
};

export function DashboardRecommendsCard({ eyebrow, subtitle, ctaLabel, href }: Props) {
  return (
    <section className="relative overflow-hidden rounded-[1rem] border border-white/10 bg-[linear-gradient(135deg,rgba(234,179,8,0.08),rgba(38,38,38,0.18)_36%,rgba(12,12,12,0.96)_100%)] px-4 py-5 sm:px-5 sm:py-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_78%_30%,rgba(234,179,8,0.12),transparent_24%)]" />

      <div className="absolute inset-y-0 right-0 hidden w-[42%] overflow-hidden md:block">
        <div className="absolute inset-y-0 right-0 w-full [mask-image:linear-gradient(to_left,black_58%,transparent_100%)]">
          <Image
            src="/ik-recommends.jpeg"
            alt="IK portrait"
            fill
            className="object-cover object-[60%_18%] opacity-65 brightness-[0.72] contrast-[1.06] saturate-[0.92]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(5,5,5,0.08),rgba(10,10,10,0.54),rgba(10,10,10,0.9)),radial-gradient(circle_at_34%_32%,rgba(234,179,8,0.16),transparent_34%),linear-gradient(to_bottom,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" />
        </div>
      </div>

      <div className="relative z-10 max-w-2xl space-y-4 md:pr-[28%] lg:pr-[30%]">
        <div className="space-y-3">
          <p className="section-eyebrow">{eyebrow}</p>
          <div className="h-px w-20 bg-gradient-to-r from-gold via-gold/35 to-transparent" />
          <p className="max-w-xl text-sm leading-7 text-zinc-200 sm:text-base">{subtitle}</p>
        </div>

        <Link href={href} className="button-secondary px-5 py-3 text-sm">
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
