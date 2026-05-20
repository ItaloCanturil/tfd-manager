import type { UserRole } from "../../lib/tfd-api";

export function ActionPanel({ role }: { role: UserRole }) {
  const actions = [
    "Criar paciente",
    "Imprimir planilha",
    "Novo agendamento",
    ...(role === "COORDINATOR" ? ["Criar conta"] : []),
  ];

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-zinc-500">Acoes rapidas</p>
        <h2 className="mt-2 text-xl font-semibold">Atalhos do painel</h2>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            className="min-h-28 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left text-sm font-semibold transition hover:border-zinc-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            key={action}
            type="button"
          >
            {action}
          </button>
        ))}
      </div>
    </section>
  );
}
