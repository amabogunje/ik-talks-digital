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
    <Link href={`/courses/${slug}`} className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111111] transition hover:-translate-y-1 hover:border-gold/40">
      <div className="relative h-56">
        <Image src={thumbnail} alt={title} fill className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>
      <div className="space-y-3 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{lessons} {lessonsLabel}</p>
        <h3 className="font-display text-2xl text-white">{title}</h3>
        <p className="line-clamp-3 text-sm leading-6 text-zinc-400">{description}</p>
      </div>
    </Link>
  );
}
