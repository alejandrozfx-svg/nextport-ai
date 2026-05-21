"use client";

const tabs = [
  { key: "all", label: "All" },
  { key: "risk", label: "At Risk" },
  { key: "review", label: "Needs Review" },
  { key: "ready", label: "Ready" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

interface FilterTabsProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  counts?: Partial<Record<TabKey, number>>;
}

export function FilterTabs({ active, onChange, counts }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={
            active === key
              ? {
                  background: "rgba(255,255,255,0.07)",
                  color: "var(--ink)",
                  border: "1px solid var(--hair-2)",
                }
              : {
                  color: "var(--ink-3)",
                  border: "1px solid transparent",
                }
          }
        >
          {label}
          {counts?.[key] !== undefined && (
            <span
              className="px-1.5 py-0.5 rounded-full font-mono"
              style={{
                background: "var(--hair)",
                color: active === key ? "var(--ink-2)" : "var(--ink-4)",
                fontSize: 10,
              }}
            >
              {counts[key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export type { TabKey };
