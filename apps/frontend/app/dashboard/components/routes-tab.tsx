import type { DashboardTrip } from "./dashboard-config";

export function RoutesTab({ trips }: { trips: DashboardTrip[] }) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-500">Rotas</p>
          <h2 className="mt-2 text-3xl font-semibold">Locais atendidos</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
            Visao das rotas e viagens ativas para organizar capacidade por
            localidade.
          </p>
        </div>
        <span className="w-fit rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {trips.length} ativa{trips.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-zinc-100 text-xs uppercase tracking-wide text-zinc-600">
            <tr>
              <th className="px-4 py-3">Localidade</th>
              <th className="px-4 py-3">Saida</th>
              <th className="px-4 py-3">Capacidade</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr className="border-t border-zinc-200" key={trip.id}>
                <td className="px-4 py-3 font-medium">{trip.name}</td>
                <td className="px-4 py-3">{formatDate(trip.departureDate)}</td>
                <td className="px-4 py-3">{trip.capacity} vagas</td>
                <td className="px-4 py-3">{trip.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(value),
  );
}
