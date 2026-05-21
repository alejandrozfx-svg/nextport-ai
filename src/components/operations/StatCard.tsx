interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, sub, color, icon }: StatCardProps) {
  return (
    <div
      className="glass-panel p-4 flex flex-col gap-1"
      style={color ? { borderTop: `2px solid ${color}` } : {}}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium" style={{ color: "var(--ink-4)" }}>
          {label}
        </p>
        {icon && <span style={{ color: color ?? "var(--ink-4)" }}>{icon}</span>}
      </div>
      <p
        className="text-2xl font-semibold font-mono tracking-tight"
        style={{ color: color ?? "var(--ink)" }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: "var(--ink-4)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}
