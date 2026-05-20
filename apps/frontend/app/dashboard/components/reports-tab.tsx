import type { DashboardTrip } from "./dashboard-config";

export function ReportsTab({ trips }: { trips: DashboardTrip[] }) {
  const totalCapacity = trips.reduce((sum, trip) => sum + trip.capacity, 0);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-zinc-500">Relatorios</p>
        <h2 className="mt-2 text-3xl font-semibold">Resumo operacional</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
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
            className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left text-sm font-semibold transition hover:border-zinc-400 hover:bg-white"
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
    <article className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </article>
  );
}
