import { InfoCard } from "@/components/app/info-card";
import { StatusPill } from "@/components/app/status-pill";
import type { Booking, Trip } from "../../lib/tfd-api";

const statusLabels: Record<Booking["status"], string> = {
  ABSENT: "Ausente",
  CANCELED: "Cancelada",
  CONFIRMED: "Confirmada",
};

export function PatientBookingsGrid({
  bookings,
  trips,
}: {
  bookings: Booking[];
  trips: Trip[];
}) {
  const tripById = new Map(trips.map((trip) => [trip.id, trip]));

  return (
    <section className="rounded-[calc(var(--radius)*4)] border border-border bg-background/70 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Agendamentos
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight">
            Reservas do paciente
          </h2>
        </div>
        <span className="w-fit rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          {bookings.length} registro{bookings.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const trip = tripById.get(booking.tripId);

            return (
              <article
                className="rounded-[calc(var(--radius)*4)] border border-border bg-muted/35 p-4"
                key={booking.id}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {booking.finalDestination}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Consulta em {formatDate(booking.appointmentDate)}
                    </p>
                  </div>
                  <StatusPill
                    label={statusLabels[booking.status]}
                    tone={getBookingTone(booking.status)}
                  />
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <InfoCard
                    href={trip ? `/trips/${trip.id}` : undefined}
                    label="Viagem"
                    value={trip ? trip.name : booking.tripId}
                  />
                  <InfoCard
                    label="Saida"
                    value={trip ? formatDate(trip.departureDate) : "Nao informada"}
                  />
                  <InfoCard
                    label="Acompanhante"
                    value={booking.hasCompanion ? "Sim" : "Nao"}
                  />
                  <InfoCard
                    label="Nome acompanhante"
                    value={booking.companionName ?? "Nao informado"}
                  />
                  <InfoCard
                    label="SUS acompanhante"
                    value={booking.companionSus ?? "Nao informado"}
                  />
                  <InfoCard
                    label="CPF acompanhante"
                    value={booking.companionCpf ?? "Nao informado"}
                  />
                </dl>
              </article>
            );
          })
        ) : (
          <div className="rounded-[calc(var(--radius)*4)] border border-dashed border-border bg-muted/35 p-6 text-sm text-muted-foreground lg:col-span-2">
            Nenhum agendamento encontrado para este paciente.
          </div>
        )}
      </div>
    </section>
  );
}

function getBookingTone(status: Booking["status"]) {
  if (status === "CONFIRMED") {
    return "success" as const;
  }

  if (status === "ABSENT") {
    return "warning" as const;
  }

  return "neutral" as const;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(value),
  );
}
