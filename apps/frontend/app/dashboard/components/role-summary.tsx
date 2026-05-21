import type { UserRole } from "../../lib/tfd-api";
import { roleLabels, type RoleHome } from "./dashboard-config";

export function RoleSummary({
  home,
  role,
}: {
  home: RoleHome;
  role: UserRole;
}) {
  return (
    <div
      className={`rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur ${home.accent}`}
    >
      <p className="text-sm font-semibold text-muted-foreground">
        {roleLabels[role]}
      </p>
      <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
        {home.focus}
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
        {home.summary}
      </p>
    </div>
  );
}
