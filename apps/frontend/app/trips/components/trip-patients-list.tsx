import Link from "next/link";
import { StatusPill } from "@/components/app/status-pill";
import type { Booking, Patient } from "../../lib/tfd-api";

const bookingStatusLabels: Record<Booking["status"], string> = {
  ABSENT: "Ausente",
  CANCELED: "Cancelada",
  CONFIRMED: "Confirmada",
};

export function TripPatientsList({
  rows,
}: {
  rows: Array<{ booking: Booking; patient: Patient | null }>;
}) {
  return (
    <section className="rounded-[calc(var(--radius)*4)] border border-border bg-background/70 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Pacientes da viagem
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight">
            Lista de embarque
          </h2>
        </div>
        <span className="w-fit rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          {rows.length} paciente{rows.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-[calc(var(--radius)*3)] border border-border">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Paciente</th>
              <th className="px-4 py-3">CPF</th>
              <th className="px-4 py-3">Destino final</th>
              <th className="px-4 py-3">Consulta</th>
              <th className="px-4 py-3">Acompanhante</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map(({ booking, patient }) => (
                <tr className="border-t border-border" key={booking.id}>
                  <td className="px-4 py-3">
                    {patient ? (
                      <Link
                        className="font-semibold text-foreground transition hover:text-primary"
                        href={`/patients/${encodeURIComponent(patient.cpf)}`}
                      >
                        {patient.name}
                      </Link>
                    ) : (
                      <span className="font-semibold text-foreground">
                        Paciente nao encontrado
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {patient?.cpf ?? "Nao informado"}
                  </td>
                  <td className="px-4 py-3">{booking.finalDestination}</td>
                  <td className="px-4 py-3">
                    {formatDate(booking.appointmentDate)}
                  </td>
                  <td className="px-4 py-3">
                    {booking.hasCompanion ? booking.companionName ?? "Sim" : "Nao"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      label={bookingStatusLabels[booking.status]}
                      tone={getBookingTone(booking.status)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                  Nenhum paciente vinculado a esta viagem.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00`),
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
