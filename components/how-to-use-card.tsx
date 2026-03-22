type Props = {
  eyebrow: string;
  title: string;
  steps: string[];
};

export function HowToUseCard({ eyebrow, title, steps }: Props) {
  return (
    <aside className="surface-card-soft p-5 sm:p-6">
      <div className="space-y-5">
        <div>
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="mt-3 font-display text-[1.8rem] tracking-[-0.03em] text-white">{title}</h2>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step} className="flex gap-4 rounded-[0.8rem] border border-white/10 bg-black/20 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.55rem] border border-gold/30 bg-gold/10 text-sm text-gold">
                {index + 1}
              </div>
              <p className="text-sm leading-7 text-zinc-300">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}