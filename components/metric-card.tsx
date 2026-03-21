type Props = {
  label: string;
  value: string | number;
  note?: string;
};

export function MetricCard({ label, value, note }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">{label}</p>
      <p className="mt-4 font-display text-4xl text-white">{value}</p>
      {note ? <p className="mt-3 text-sm text-zinc-400">{note}</p> : null}
    </div>
  );
}
