export function AkHeroPortrait() {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.30),transparent_58%)] blur-3xl" />
      <svg viewBox="0 0 440 620" className="relative w-full drop-shadow-[0_20px_80px_rgba(0,0,0,0.65)]">
        <defs>
          <linearGradient id="suit" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1f1f23" />
            <stop offset="50%" stopColor="#08080a" />
            <stop offset="100%" stopColor="#23232a" />
          </linearGradient>
          <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9c5a43" />
            <stop offset="45%" stopColor="#c77a58" />
            <stop offset="100%" stopColor="#6f3a2c" />
          </linearGradient>
          <linearGradient id="lapel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#303038" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>
          <radialGradient id="halo" cx="50%" cy="30%" r="55%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        <circle cx="245" cy="165" r="145" fill="url(#halo)" opacity="0.9" />

        <ellipse cx="225" cy="140" rx="84" ry="96" fill="url(#skin)" />
        <ellipse cx="225" cy="82" rx="74" ry="54" fill="#7f4a36" />
        <path d="M178 132c14-10 32-15 48-15s34 5 48 15" fill="none" stroke="#5f3428" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
        <ellipse cx="194" cy="144" rx="20" ry="11" fill="#ffffff" opacity="0.08" />
        <ellipse cx="257" cy="144" rx="20" ry="11" fill="#ffffff" opacity="0.08" />
        <ellipse cx="194" cy="148" rx="14" ry="8" fill="#2b1b1b" />
        <ellipse cx="257" cy="148" rx="14" ry="8" fill="#2b1b1b" />
        <circle cx="197" cy="148" r="3" fill="#f6f3f0" opacity="0.8" />
        <circle cx="260" cy="148" r="3" fill="#f6f3f0" opacity="0.8" />
        <path d="M212 177c6 5 13 8 20 8 8 0 15-3 21-8" fill="none" stroke="#7b4633" strokeWidth="4" strokeLinecap="round" />
        <path d="M190 207c19 20 57 22 87 0" fill="#ffffff" opacity="0.96" />
        <path d="M199 204c17 12 51 12 69 0" fill="none" stroke="#cc6f56" strokeWidth="5" strokeLinecap="round" />
        <path d="M214 216c4 18 22 30 41 30 18 0 34-11 38-28" fill="none" stroke="#2a1715" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
        <path d="M218 214c2 7 10 12 18 12 8 0 15-5 17-12" fill="none" stroke="#1f1010" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        <path d="M181 238c17 18 74 23 99 1" fill="none" stroke="#8a5140" strokeWidth="6" strokeLinecap="round" opacity="0.45" />

        <path d="M150 283c17-24 50-36 79-36 39 0 74 18 94 53l30 54-56 26-25-43-10 96-135-7 17-103-29 64-55-23 35-81z" fill="url(#suit)" />
        <path d="M186 274c15 15 26 22 42 22 18 0 31-7 46-23l18 34-28 24h-71l-27-26 20-31z" fill="url(#lapel)" />
        <path d="M216 289h20l7 45-16 19-18-19 7-45z" fill="#0e0e11" />
        <rect x="168" y="341" width="142" height="214" rx="56" fill="url(#suit)" />
        <path d="M170 364c27 8 53 15 81 15 29 0 45-3 78-14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <path d="M170 418c27 8 53 15 81 15 29 0 45-3 78-14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <path d="M170 472c27 8 53 15 81 15 29 0 45-3 78-14" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />

        <path d="M130 330c-22 28-34 60-34 94 0 14 11 26 26 26 13 0 25-10 27-24l8-55c4-21-4-36-27-41z" fill="url(#suit)" />
        <path d="M320 341c25 9 37 26 36 48l-4 60c-1 17-14 30-31 30-16 0-29-12-30-28l-4-67c-2-21 7-37 33-43z" fill="url(#suit)" />

        <path d="M134 448c13 5 24 15 29 28 4 12 1 25-7 35-8 10-20 17-33 15-13-1-24-10-28-22-5-12-2-25 6-35 8-11 20-18 33-21z" fill="url(#skin)" />
        <path d="M331 462c12 3 24 10 31 21 8 10 9 23 4 35-6 13-18 20-31 19-13-2-24-10-29-22-5-12-4-25 3-35 6-9 13-15 22-18z" fill="url(#skin)" />

        <circle cx="160" cy="455" r="11" fill="#d0d0d4" opacity="0.92" />
        <circle cx="160" cy="455" r="7" fill="#151519" />
        <path d="M296 463c6 0 11 5 11 11s-5 11-11 11-11-5-11-11 5-11 11-11z" fill="#0c0c10" opacity="0.95" />
      </svg>
    </div>
  );
}
