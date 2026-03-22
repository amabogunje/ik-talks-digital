type ProgressItem = {
  label: string;
  value: string;
  note: string;
  accent?: boolean;
};

export function ProgressSummaryStrip({ title, items }: { title: string; items: ProgressItem[] }) {
  return (
    <section className="surface-card p-5 sm:p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{title}</p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className={`${item.accent ? "border-gold/20 bg-gold/10" : "surface-card-muted"} rounded-[0.95rem] border p-4`}>
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{item.label}</p>
            <p className="mt-3 font-display text-3xl text-white">{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
