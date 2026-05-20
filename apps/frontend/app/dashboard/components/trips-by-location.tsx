import type { DashboardTrip } from "./dashboard-config";

export function TripsByLocation({
  patientSearch,
  trips,
}: {
  patientSearch: string;
  trips: DashboardTrip[];
}) {
  const passengerPreview = patientSearch.trim()
    ? `Filtro ativo: ${patientSearch.trim()}`
    : "Nenhum paciente filtrado";

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">
            Viagens ativas
          </p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight">
            Por localidade
          </h2>
        </div>
        <span className="w-fit rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {trips.length} rota{trips.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {trips.map((trip) => (
          <article
            className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
            key={trip.id}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="text-lg font-semibold">{trip.name}</h3>
              <span className="w-fit rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600">
                {formatDate(trip.departureDate)}
              </span>
            </div>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <TripMetric label="Capacidade" value={`${trip.capacity} vagas`} />
              <TripMetric label="Status" value={trip.status} />
            </dl>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4">
        <p className="text-sm font-semibold text-zinc-700">
          {passengerPreview}
        </p>
        <p className="mt-1 text-sm leading-6 text-zinc-500">
          A busca esta pronta para cruzar paciente, localidade e reservas da
          viagem selecionada.
        </p>
      </div>
    </section>
  );
}

function TripMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-base font-semibold">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(value),
  );
}
