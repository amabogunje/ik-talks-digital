import type { RecommendationContentType } from "@/lib/recommends";

type Props = {
  contentType: RecommendationContentType;
  className?: string;
};

export function ResourceTypeIcon({ contentType, className = "h-4 w-4" }: Props) {
  if (contentType === "video") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
        <rect x="1.5" y="2.5" width="13" height="11" rx="2" stroke="currentColor" strokeWidth="1.25" />
        <path d="M6 5.5L10.5 8L6 10.5V5.5Z" fill="currentColor" />
      </svg>
    );
  }

  if (contentType === "podcast") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
        <path d="M5.5 6.25a2.5 2.5 0 1 1 5 0c0 1.3-.97 2.38-2.22 2.49v2.01h1.47v1.25H6.25v-1.25h1.47V8.74A2.5 2.5 0 0 1 5.5 6.25Z" fill="currentColor" />
        <path d="M3.5 6.25a4.5 4.5 0 0 1 9 0" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <path d="M1.75 6.25a6.25 6.25 0 0 1 12.5 0" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.7" />
      </svg>
    );
  }

  if (contentType === "tool") {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
        <path d="M9.57 2.25a3.5 3.5 0 0 0 1.09 3.09l-4.9 4.9a1.75 1.75 0 1 0 2.47 2.47l4.9-4.9a3.5 3.5 0 0 0-3.56-5.56Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M4 2.25h5.75L12 4.5v9.25H4V2.25Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M9.75 2.5V4.75H12" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M5.5 7h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M5.5 9.5h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}
