import type { UserRole } from "../../lib/tfd-api";

export function ActionPanel({ role }: { role: UserRole }) {
  const actions = [
    "Criar paciente",
    "Imprimir planilha",
    "Novo agendamento",
    ...(role === "COORDINATOR" ? ["Criar conta"] : []),
  ];

  return (
    <section className="rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/90 p-5 shadow-sm backdrop-blur">
      <div>
        <p className="text-sm font-semibold text-muted-foreground">
          Acoes rapidas
        </p>
        <h2 className="mt-2 font-serif text-xl font-semibold tracking-tight">
          Atalhos do painel
        </h2>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            className="min-h-28 rounded-2xl border border-border bg-muted/50 p-4 text-left text-sm font-semibold transition hover:border-primary/40 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring/40"
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
