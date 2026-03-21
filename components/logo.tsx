export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 bg-gold/10 font-display text-lg text-gold">
        IK
      </div>
      <div>
        <p className="font-display text-lg tracking-wide text-white">IK Talks Digital</p>
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Speak. Lead. Host.</p>
      </div>
    </div>
  );
}
