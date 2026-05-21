import type { AuthenticatedUser } from "../../lib/tfd-api";
import {
  dashboardTabs,
  roleLabels,
  type DashboardTab,
  type RoleHome,
} from "./dashboard-config";

export function DashboardShell({
  activeTab,
  children,
  home,
  onSelectTab,
  onSignOut,
  user,
}: {
  activeTab: DashboardTab;
  children: React.ReactNode;
  home: RoleHome;
  onSelectTab: (tab: DashboardTab) => void;
  onSignOut: () => void;
  user: AuthenticatedUser;
}) {
  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,hsl(var(--muted)/0.5),transparent_26%),radial-gradient(circle_at_top_right,hsl(var(--primary)/0.16),transparent_28%)] text-foreground">
      <header className="border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              TFD
            </p>
            <h1 className="font-serif text-2xl font-semibold tracking-tight">
              {home.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/90 px-3 py-2 shadow-sm backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {initials || "TF"}
              </span>
              <span>
                <span className="block text-sm font-semibold">{user.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {roleLabels[user.role]} - {user.username}
                </span>
              </span>
            </div>
            <button
              className="h-10 rounded-lg border border-border bg-background px-4 text-sm font-semibold transition hover:bg-accent hover:text-accent-foreground"
              onClick={onSignOut}
              type="button"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[240px_1fr]">
        <nav className="rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/90 p-3 shadow-sm backdrop-blur">
          {dashboardTabs.map((tab) => (
            <button
              className={`block w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="space-y-6">{children}</section>
      </div>
    </main>
  );
}
