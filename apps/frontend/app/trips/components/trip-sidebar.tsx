import type { Route, RouteSchedule, Trip } from "../../lib/tfd-api";

const tripStatusLabels: Record<Trip["status"], string> = {
  ACTIVE: "Ativa",
  CANCELED: "Cancelada",
};

export function TripSidebar({
  availableSeats,
  reservedSeats,
  route,
  schedule,
  trip,
}: {
  availableSeats: number;
  reservedSeats: number;
  route: Route | null;
  schedule: RouteSchedule | null;
  trip: Trip;
}) {
  return (
    <aside className="space-y-4">
      <TripSidebarCard
        description="Resumo operacional da viagem e da ocupacao atual."
        title="Operacao"
      >
        <TripSidebarItem label="Status" value={tripStatusLabels[trip.status]} />
        <TripSidebarItem label="Capacidade total" value={`${trip.capacity} vagas`} />
        <TripSidebarItem label="Assentos reservados" value={String(reservedSeats)} />
        <TripSidebarItem label="Assentos livres" value={String(availableSeats)} />
      </TripSidebarCard>

      <TripSidebarCard
        description="Dados da rota vinculada ao agendamento recorrente."
        title="Rota e horario"
      >
        <TripSidebarItem label="Destino da rota" value={route?.destination ?? "-"} />
        <TripSidebarItem label="Saida" value={formatDate(trip.departureDate)} />
        <TripSidebarItem
          label="Horario"
          value={schedule ? schedule.departureTime.slice(0, 5) : "-"}
        />
        <TripSidebarItem label="Turno" value={schedule?.label ?? "-"} />
      </TripSidebarCard>

      <TripSidebarCard
        description="Metadados da viagem no sistema."
        title="Registro"
      >
        <TripSidebarItem label="ID da viagem" value={trip.id} />
        <TripSidebarItem label="Criada em" value={formatDateTime(trip.createdAt)} />
        <TripSidebarItem label="Atualizada em" value={formatDateTime(trip.updatedAt)} />
        <TripSidebarItem
          label="Observacoes"
          value={trip.notes?.trim() ? trip.notes : "Nenhuma observacao"}
        />
      </TripSidebarCard>
    </aside>
  );
}

function TripSidebarCard({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="rounded-[calc(var(--radius)*4)] border border-border bg-background/70 p-5">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      <dl className="mt-4 space-y-3">{children}</dl>
    </section>
  );
}

function TripSidebarItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-semibold text-foreground">
        {value}
      </dd>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00`),
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
