import type { UserRole } from "../../lib/tfd-api";
import { roleLabels } from "./dashboard-config";

export function DashboardMetrics({ role }: { role: UserRole }) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {[
        ["Hoje", "3 viagens", "lg:col-span-1"],
        ["Ocupacao", "76%", "lg:col-span-1"],
        [
          "Pendencias",
          role === "TRANSPORT" ? "2 embarques" : "5 cadastros",
          "lg:col-span-1",
        ],
        ["Perfil", roleLabels[role], "lg:col-span-1"],
      ].map(([label, value, span]) => (
        <div
          className={`rounded-lg border border-zinc-200 bg-white p-5 shadow-sm ${span}`}
          key={label}
        >
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-2 break-words text-2xl font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
}
