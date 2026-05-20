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
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              TFD
            </p>
            <h1 className="text-2xl font-semibold">{home.title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white">
                {initials || "TF"}
              </span>
              <span>
                <span className="block text-sm font-semibold">{user.name}</span>
                <span className="block text-xs text-zinc-500">
                  {roleLabels[user.role]} - {user.username}
                </span>
              </span>
            </div>
            <button
              className="h-10 rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold transition hover:bg-zinc-50"
              onClick={onSignOut}
              type="button"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[240px_1fr]">
        <nav className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
          {dashboardTabs.map((tab) => (
            <button
              className={`block w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
                activeTab === tab.id
                  ? "bg-zinc-950 text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
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
