export function HeroMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[calc(var(--radius)*3)] border border-border/70 bg-background/80 p-4 shadow-sm">
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </span>
      <p className="mt-3 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}
