export function DashboardPanelSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/90 p-6 shadow-sm">
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="mt-4 h-8 w-64 rounded bg-muted" />
        <div className="mt-3 h-20 w-full rounded bg-muted" />
      </div>
      <div className="animate-pulse rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/90 p-6 shadow-sm">
        <div className="h-6 w-40 rounded bg-muted" />
        <div className="mt-4 h-72 w-full rounded bg-muted" />
      </div>
    </div>
  );
}
