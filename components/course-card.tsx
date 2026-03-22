import Image from "next/image";
import Link from "next/link";

type Props = {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  lessons: number;
  lessonsLabel?: string;
};

export function CourseCard({ slug, title, description, thumbnail, lessons, lessonsLabel = "lessons" }: Props) {
  return (
    <Link href={`/courses/${slug}`} className="group overflow-hidden rounded-[0.8rem] border border-white/10 bg-[rgba(30,30,30,0.88)] shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="relative h-44 sm:h-52 lg:h-60">
        <Image src={thumbnail} alt={title} fill className="object-cover transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />
      </div>
      <div className="space-y-2.5 p-4 sm:space-y-3 sm:p-5 lg:p-6">
        <p className="section-eyebrow text-[11px] sm:text-xs">{lessons} {lessonsLabel}</p>
        <h3 className="font-display text-[1.2rem] leading-tight tracking-[-0.02em] text-white sm:text-[1.45rem] lg:text-[1.7rem]">{title}</h3>
        <p className="line-clamp-3 text-sm leading-6 text-zinc-400">{description}</p>
      </div>
    </Link>
  );
}
