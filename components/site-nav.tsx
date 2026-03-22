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

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav({ items }: Props) {
  const pathname = usePathname();

  return (
    <nav className="-mx-1 flex items-center gap-4 overflow-x-auto px-1 text-sm tracking-[0.01em] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-nowrap lg:justify-end lg:gap-7 lg:px-0">
      {items.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap transition ${active ? "text-gold" : "text-zinc-300 hover:text-white"}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
