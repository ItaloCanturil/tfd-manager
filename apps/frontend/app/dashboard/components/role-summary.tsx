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
      className={`rounded-lg border border-l-4 border-zinc-200 bg-white p-6 shadow-sm ${home.accent}`}
    >
      <p className="text-sm font-semibold text-zinc-500">{roleLabels[role]}</p>
      <h2 className="mt-2 text-3xl font-semibold">{home.focus}</h2>
      <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
        {home.summary}
      </p>
    </div>
  );
}
