import type { DashboardTrip } from "./dashboard-config";

export function ReportsTab({ trips }: { trips: DashboardTrip[] }) {
  const totalCapacity = trips.reduce((sum, trip) => sum + trip.capacity, 0);

  return (
    <section className="rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur">
      <div>
        <p className="text-sm font-semibold text-muted-foreground">
          Relatorios
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
          Resumo operacional
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Indicadores iniciais para acompanhar viagens, ocupacao e demanda por
          localidade.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <ReportMetric label="Viagens ativas" value={String(trips.length)} />
        <ReportMetric label="Capacidade total" value={`${totalCapacity}`} />
        <ReportMetric label="Relatorios prontos" value="3" />
      </div>

      <div className="mt-6 grid gap-3">
        {[
          "Pacientes por destino",
          "Ocupacao por viagem",
          "Historico de agendamentos",
        ].map((report) => (
          <button
            className="rounded-2xl border border-border bg-muted/50 p-4 text-left text-sm font-semibold transition hover:border-primary/40 hover:bg-accent"
            key={report}
            type="button"
          >
            {report}
          </button>
        ))}
      </div>
    </section>
  );
}

function ReportMetric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-border bg-muted/50 p-4">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 font-serif text-2xl font-semibold tracking-tight">
        {value}
      </p>
    </article>
  );
}
