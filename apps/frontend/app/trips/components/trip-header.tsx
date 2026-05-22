import Link from "next/link";
import { CalendarDays, Clock3, MapPinned, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HeroMetric } from "@/components/app/hero-metric";
import { StatusPill } from "@/components/app/status-pill";
import { cn } from "@/lib/utils";
import type { Route, RouteSchedule, Trip } from "../../lib/tfd-api";

const tripStatusLabels: Record<Trip["status"], string> = {
  ACTIVE: "Ativa",
  CANCELED: "Cancelada",
};

export function TripHeader({
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
    <div className="border-b border-border/70 bg-[linear-gradient(135deg,hsl(var(--primary)/0.15),transparent_55%),linear-gradient(180deg,hsl(var(--muted)/0.55),transparent)] px-6 py-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Viagem
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground">
            {trip.name}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {route?.destination ?? "Destino nao identificado"} /{" "}
            {schedule
              ? `${schedule.label} as ${formatTime(schedule.departureTime)}`
              : "Horario nao identificado"}
          </p>
          {trip.notes ? (
            <p className="mt-4 max-w-2xl rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm leading-6 text-muted-foreground">
              {trip.notes}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusPill
            label={tripStatusLabels[trip.status]}
            size="md"
            tone={trip.status === "ACTIVE" ? "success" : "danger"}
          />
          <Link
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            href="/dashboard"
          >
            Voltar ao dashboard
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <HeroMetric
          icon={<CalendarDays className="size-4" />}
          label="Data da saida"
          value={formatDate(trip.departureDate)}
        />
        <HeroMetric
          icon={<Clock3 className="size-4" />}
          label="Horario"
          value={schedule ? formatTime(schedule.departureTime) : "Nao informado"}
        />
        <HeroMetric
          icon={<MapPinned className="size-4" />}
          label="Destino"
          value={route?.destination ?? "Nao informado"}
        />
        <HeroMetric
          icon={<Users className="size-4" />}
          label="Lotacao"
          value={`${reservedSeats}/${trip.capacity} assentos (${availableSeats} livres)`}
        />
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00`),
  );
}

function formatTime(value: string) {
  return value.slice(0, 5);
}
