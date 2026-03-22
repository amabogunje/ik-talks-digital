import type { RecommendationCategory, RecommendationContentType } from "@/lib/recommends";

type FilterOption = {
  value: string;
  label: string;
};

type Props = {
  searchLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  categoryLabel: string;
  categoryValue: RecommendationCategory | "ALL";
  onCategoryChange: (value: RecommendationCategory | "ALL") => void;
  categoryOptions: FilterOption[];
  allCategoriesLabel: string;
  typeLabel: string;
  typeValue: RecommendationContentType | "ALL";
  onTypeChange: (value: RecommendationContentType | "ALL") => void;
  typeOptions: FilterOption[];
  allTypesLabel: string;
};

function FilterButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[0.55rem] border px-3 py-2 text-sm transition ${active ? "border-gold/35 bg-gold/10 text-gold" : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/20 hover:text-white"}`}
    >
      {label}
    </button>
  );
}

export function CategoryFilterBar({
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  categoryLabel,
  categoryValue,
  onCategoryChange,
  categoryOptions,
  allCategoriesLabel,
  typeLabel,
  typeValue,
  onTypeChange,
  typeOptions,
  allTypesLabel
}: Props) {
  return (
    <section className="surface-card-soft p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] xl:grid-cols-[1.2fr_0.9fr_0.9fr] xl:items-start">
        <label className="space-y-2">
          <span className="text-sm text-zinc-300">{searchLabel}</span>
          <input className="surface-input" value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder={searchPlaceholder} />
        </label>

        <div className="space-y-2">
          <p className="text-sm text-zinc-300">{categoryLabel}</p>
          <div className="flex flex-wrap gap-2">
            <FilterButton active={categoryValue === "ALL"} label={allCategoriesLabel} onClick={() => onCategoryChange("ALL")} />
            {categoryOptions.map((option) => (
              <FilterButton key={option.value} active={categoryValue === option.value} label={option.label} onClick={() => onCategoryChange(option.value as RecommendationCategory)} />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-zinc-300">{typeLabel}</p>
          <div className="flex flex-wrap gap-2">
            <FilterButton active={typeValue === "ALL"} label={allTypesLabel} onClick={() => onTypeChange("ALL")} />
            {typeOptions.map((option) => (
              <FilterButton key={option.value} active={typeValue === option.value} label={option.label} onClick={() => onTypeChange(option.value as RecommendationContentType)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}