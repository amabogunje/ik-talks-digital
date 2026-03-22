import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center transition hover:opacity-90" aria-label="Go to homepage">
      <Image
        src="/iktalksdigital-logo.png"
        alt="IK Talks Digital"
        width={420}
        height={126}
        priority
        className="h-14 w-auto object-contain sm:h-16 lg:h-20"
      />
    </Link>
  );
}
