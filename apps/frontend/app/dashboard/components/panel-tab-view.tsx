import type {
  AuthenticatedUser,
  Booking,
  Patient,
} from "../../lib/tfd-api";
import { ActionPanel } from "./action-panel";
import { DashboardMetrics } from "./dashboard-metrics";
import type { DashboardTrip, RoleHome } from "./dashboard-config";
import { PatientSearch } from "./patient-search";
import { RoleSummary } from "./role-summary";
import { TripsByLocation } from "./trips-by-location";

type PanelTabViewProps = {
  bookings: Booking[];
  home: RoleHome;
  onPatientSearch: (value: string) => void;
  onTripDateChange: (value: string) => void;
  patientSearch: string;
  patients: Patient[];
  role: AuthenticatedUser["role"];
  tripDate: string;
  trips: DashboardTrip[];
};

export function PanelTabView({
  bookings,
  home,
  onPatientSearch,
  onTripDateChange,
  patientSearch,
  patients,
  role,
  tripDate,
  trips,
}: PanelTabViewProps) {
  return (
    <>
      <RoleSummary home={home} role={role} />

      <div className="grid auto-rows-[minmax(120px,auto)] gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
            <PatientSearch onChange={onPatientSearch} value={patientSearch} />
            <TripFilterBar onDateChange={onTripDateChange} value={tripDate} />
          </div>
          <TripsByLocation
            bookings={bookings}
            patientSearch={patientSearch}
            patients={patients}
            selectedDate={tripDate}
            trips={trips}
          />
        </div>

        <ActionPanel role={role} />
      </div>

      <DashboardMetrics role={role} />
    </>
  );
}

function TripFilterBar({
  onDateChange,
  value,
}: {
  onDateChange: (value: string) => void;
  value: string;
}) {
  return (
    <section className="rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/90 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Filtro</p>
          <h2 className="mt-1 font-serif text-base font-semibold tracking-tight text-foreground">
            Viagens por data
          </h2>
        </div>
        <button
          className="rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent"
          onClick={() => onDateChange(getTodayIsoDate())}
          type="button"
        >
          Hoje
        </button>
      </div>

      <label className="mt-4 block text-sm font-medium text-foreground">
        Data da viagem
        <input
          className="mt-2 h-12 w-full rounded-lg border border-input bg-background px-4 text-base text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          onChange={(event) => onDateChange(event.target.value)}
          type="date"
          value={value}
        />
      </label>
    </section>
  );
}

function getTodayIsoDate() {
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 10);
}
