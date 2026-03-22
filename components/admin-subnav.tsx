"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  href: string;
  label: string;
};

type Props = {
  items: Item[];
};

export function AdminSubnav({ items }: Props) {
  const pathname = usePathname();

  return (
    <nav className="surface-card-soft p-3 sm:p-4">
      <div className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-[0.7rem] px-4 py-3 text-sm transition ${active ? "border border-gold/30 bg-gold/10 text-gold" : "border border-transparent text-zinc-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
