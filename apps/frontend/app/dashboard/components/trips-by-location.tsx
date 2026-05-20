import type { Booking, Patient } from "../../lib/tfd-api";
import type { DashboardTrip } from "./dashboard-config";

const bookingStatusLabels: Record<Booking["status"], string> = {
  ABSENT: "Ausente",
  CANCELED: "Cancelada",
  CONFIRMED: "Confirmada",
};

const tripStatusLabels: Record<DashboardTrip["status"], string> = {
  ACTIVE: "Ativa",
  CANCELED: "Cancelada",
};

export function TripsByLocation({
  bookings,
  patientSearch,
  patients,
  selectedDate,
  trips,
}: {
  bookings: Booking[];
  patientSearch: string;
  patients: Patient[];
  selectedDate: string;
  trips: DashboardTrip[];
}) {
  const patientById = new Map(patients.map((patient) => [patient.id, patient]));
  const searchTerm = patientSearch.trim().toLowerCase();
  const visibleBookings = searchTerm.length > 0
    ? bookings.filter((booking) => {
        const patient = patientById.get(booking.patientId);

        if (!patient) {
          return false;
        }

        return [patient.name, patient.cpf, patient.susCard].some((value) =>
          value.toLowerCase().includes(searchTerm),
        );
      })
    : bookings;
  const bookingsByTripId = groupBookingsByTrip(visibleBookings);
  const visibleTrips = trips
    .filter((trip) => trip.departureDate.slice(0, 10) === selectedDate)
    .filter((trip) =>
      searchTerm.length > 0 ? bookingsByTripId.has(trip.id) : true,
    )
    .sort((first, second) => first.name.localeCompare(second.name));
  const todayLabel = formatDate(selectedDate);
  const patientPreview = patientSearch.trim()
    ? `Busca ativa: ${patientSearch.trim()}`
    : "Nenhum paciente filtrado";

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">
            Viagens do dia
          </p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight">
            {todayLabel}
          </h2>
        </div>
        <span className="w-fit rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {visibleTrips.length}{" "}
          {visibleTrips.length === 1 ? "viagem" : "viagens"}
          {" / "}
          {visibleBookings.length} paciente
          {visibleBookings.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {visibleTrips.length > 0 ? (
          visibleTrips.map((trip) => {
            const tripBookings = (bookingsByTripId.get(trip.id) ?? []).sort(
              (first, second) => {
                const firstName =
                  patientById.get(first.patientId)?.name ?? first.patientId;
                const secondName =
                  patientById.get(second.patientId)?.name ?? second.patientId;

                return firstName.localeCompare(secondName);
              },
            );

            return (
              <article
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                key={trip.id}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{trip.name}</h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      Saida em {formatDate(trip.departureDate)}
                    </p>
                  </div>
                  <span className="w-fit rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600">
                    {tripBookings.length} paciente
                    {tripBookings.length === 1 ? "" : "s"}
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  <TripMetric
                    label="Capacidade"
                    value={`${trip.capacity} vagas`}
                  />
                  <TripMetric
                    label="Status"
                    value={tripStatusLabels[trip.status]}
                  />
                </dl>

                <div className="mt-4 rounded-lg border border-dashed border-zinc-300 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Pacientes da viagem
                  </p>
                  {tripBookings.length > 0 ? (
                    <ul className="mt-3 space-y-3">
                      {tripBookings.map((booking) => {
                        const patient = patientById.get(booking.patientId);

                        return (
                          <li
                            className="flex flex-col gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3"
                            key={booking.id}
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="font-semibold text-zinc-900">
                                  {patient?.name ?? booking.patientId}
                                </p>
                                <p className="mt-1 text-sm text-zinc-500">
                                  {patient?.cpf ?? "CPF indisponivel"} -{" "}
                                  {booking.finalDestination}
                                </p>
                              </div>
                              <span className="w-fit rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-semibold text-zinc-600">
                                {bookingStatusLabels[booking.status]}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500">
                              Consulta em {formatDate(booking.appointmentDate)}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-zinc-500">
                      Nenhum paciente agendado para esta viagem na data
                      selecionada.
                    </p>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600 md:col-span-2">
            Nenhuma viagem encontrada para a data selecionada.
          </div>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4">
        <p className="text-sm font-semibold text-zinc-700">{patientPreview}</p>
        <p className="mt-1 text-sm leading-6 text-zinc-500">
          A lista abaixo cruza a data escolhida com as reservas e mostra os
          pacientes de cada viagem.
        </p>
      </div>
    </section>
  );
}

function groupBookingsByTrip(bookings: Booking[]) {
  const grouped = new Map<string, Booking[]>();

  for (const booking of bookings) {
    const tripBookings = grouped.get(booking.tripId) ?? [];
    tripBookings.push(booking);
    grouped.set(booking.tripId, tripBookings);
  }

  return grouped;
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
