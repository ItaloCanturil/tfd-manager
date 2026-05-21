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
          className={`rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/90 p-5 shadow-sm backdrop-blur ${span}`}
          key={label}
        >
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 break-words font-serif text-2xl font-semibold tracking-tight">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
