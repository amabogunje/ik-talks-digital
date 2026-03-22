import Link from "next/link";
import { BookOpen, Clapperboard, Mic } from "lucide-react";

type QuickActionCardProps = {
  title: string;
  href: string;
  icon: "practice" | "script" | "courses";
};

const iconMap = {
  practice: Mic,
  script: Clapperboard,
  courses: BookOpen
} as const;

export function QuickActionCard({ title, href, icon }: QuickActionCardProps) {
  const Icon = iconMap[icon];

  return (
    <Link
      href={href}
      className="flex min-h-24 flex-col items-center justify-center gap-3 rounded-[0.85rem] border border-white/12 bg-[rgba(255,255,255,0.06)] px-4 py-5 text-center transition hover:border-gold/30 hover:bg-[rgba(255,255,255,0.1)]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-[0.75rem] border border-gold/30 bg-gold/15 text-gold shadow-[0_10px_24px_rgba(234,179,8,0.12)]">
        <Icon size={18} strokeWidth={1.8} />
      </div>
      <span className="font-display text-sm leading-5 text-white sm:text-base">{title}</span>
    </Link>
  );
}
