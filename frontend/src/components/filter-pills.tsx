"use client";

interface CategoryOption {
  id: string;
  name: string;
}

interface FilterPillsProps {
  categories: CategoryOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function FilterPills({ categories, selectedId, onSelect }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((cat) => {
        const isActive = cat.id === selectedId;

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 border cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              isActive
                ? "bg-primary text-on-primary border-primary shadow-sm scale-103"
                : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:border-primary hover:text-primary"
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
