function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-muted ${className}`} />;
}

export function DashboardPageSkeleton() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,hsl(var(--muted)/0.5),transparent_26%),radial-gradient(circle_at_top_right,hsl(var(--primary)/0.16),transparent_28%)] text-foreground">
      <div className="border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <SkeletonBlock className="h-3 w-16" />
            <SkeletonBlock className="h-8 w-56" />
          </div>
          <SkeletonBlock className="h-12 w-64" />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[260px_1fr]">
        <div className="space-y-3 rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/90 p-3 shadow-sm">
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
        </div>
        <div className="space-y-6">
          <SkeletonBlock className="h-40 w-full" />
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <SkeletonBlock className="h-[28rem] w-full" />
            <SkeletonBlock className="h-[28rem] w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
