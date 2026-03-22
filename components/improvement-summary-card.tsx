type TrendItem = {
  label: string;
  status: string;
  tone?: "up" | "steady" | "warn";
};

export function ImprovementSummaryCard({ title, items, emptyText }: { title: string; items: TrendItem[]; emptyText: string }) {
  return (
    <div className="surface-card p-5 sm:p-6">
      <h2 className="font-display text-2xl text-white">{title}</h2>
      {items.length ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {items.map((item) => (
            <div key={item.label} className="rounded-full border border-white/10 bg-[rgba(44,44,44,0.86)] px-4 py-2 text-sm text-white">
              <span className="text-zinc-400">{item.label}:</span>
              <span className="ml-2">{item.status}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-zinc-400">{emptyText}</p>
      )}
    </div>
  );
}
