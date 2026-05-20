"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearAccessToken,
  readAccessToken,
  saveAccessToken,
} from "../../lib/auth-session";
import {
  apiUrl,
  type Booking,
  getCurrentUser,
  listActiveTrips,
  listBookingsByAppointment,
  listPatients,
  listRouteSchedules,
  listRoutes,
  type AuthenticatedUser,
  type Patient,
} from "../../lib/tfd-api";
import { ActionPanel } from "./action-panel";
import { DashboardMetrics } from "./dashboard-metrics";
import {
  fallbackTrips,
  roleHome,
  type DashboardRoute,
  type DashboardRouteSchedule,
  type DashboardTab,
  type DashboardTrip,
  type RoleHome,
} from "./dashboard-config";
import { DashboardShell } from "./dashboard-shell";
import { PatientSearch } from "./patient-search";
import { PatientsTab } from "./patients-tab";
import { ReportsTab } from "./reports-tab";
import { RoleSummary } from "./role-summary";
import { RoutesTab } from "./routes-tab";
import { TripsByLocation } from "./trips-by-location";

type SessionState =
  | { status: "checking"; user: null }
  | { status: "authenticated"; user: AuthenticatedUser };

export function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState>({
    status: "checking",
    user: null,
  });
  const [activeTrips, setActiveTrips] = useState<DashboardTrip[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [routes, setRoutes] = useState<DashboardRoute[]>([]);
  const [routeSchedules, setRouteSchedules] = useState<
    DashboardRouteSchedule[]
  >([]);

  useEffect(() => {
    const token = readAccessToken();

    if (!token) {
      clearAccessToken();
      router.replace("/login");
      return;
    }

    getCurrentUser(token)
      .then((user) => {
        saveAccessToken(token);
        setSession({ status: "authenticated", user });
        return Promise.all([
          listActiveTrips(token).catch(() => []),
          listPatients(token).catch(() => []),
          listRoutes(token).catch(() => []),
          listRouteSchedules(token).catch(() => []),
        ]);
      })
      .then(([trips, patientList, routeList, scheduleList]) => {
        setActiveTrips(trips);
        setPatients(patientList);
        setRoutes(routeList);
        setRouteSchedules(scheduleList);
      })
      .catch(() => {
        clearAccessToken();
        router.replace("/login");
      });
  }, [router]);

  function handleSignOut() {
    clearAccessToken();
    router.replace("/login");
    router.refresh();
  }

  if (session.status === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-6 text-zinc-950">
        <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">TFD</p>
          <h1 className="mt-2 text-2xl font-semibold">Abrindo dashboard</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Validando a sessao atual com o backend em {apiUrl}.
          </p>
        </div>
      </main>
    );
  }

  return (
    <RoleDashboard
      onSignOut={handleSignOut}
      patients={patients}
      routes={routes}
      routeSchedules={routeSchedules}
      token={readAccessToken() ?? ""}
      trips={activeTrips.length > 0 ? activeTrips : fallbackTrips}
      user={session.user}
    />
  );
}

function RoleDashboard({
  onSignOut,
  patients,
  routes,
  routeSchedules,
  token,
  trips,
  user,
}: {
  onSignOut: () => void;
  patients: Patient[];
  routes: DashboardRoute[];
  routeSchedules: DashboardRouteSchedule[];
  token: string;
  trips: DashboardTrip[];
  user: AuthenticatedUser;
}) {
  const home = roleHome[user.role];
  const [activeTab, setActiveTab] = useState<DashboardTab>("painel");
  const [patientSearch, setPatientSearch] = useState("");
  const [tripDate, setTripDate] = useState(getTodayIsoDate());
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    let isActive = true;

    if (!token) {
      setBookings([]);
      return () => {
        isActive = false;
      };
    }

    listBookingsByAppointment(token, tripDate)
      .then((bookingList) => {
        if (isActive) {
          setBookings(bookingList);
        }
      })
      .catch(() => {
        if (isActive) {
          setBookings([]);
        }
      });

    return () => {
      isActive = false;
    };
  }, [token, tripDate]);

  return (
    <DashboardShell
      activeTab={activeTab}
      home={home}
      onSelectTab={setActiveTab}
      onSignOut={onSignOut}
      user={user}
    >
      {activeTab === "painel" ? (
        <PanelTab
          home={home}
          onPatientSearch={setPatientSearch}
          onTripDateChange={setTripDate}
          patientSearch={patientSearch}
          tripDate={tripDate}
          bookings={bookings}
          role={user.role}
          patients={patients}
          trips={trips}
        />
      ) : null}
      {activeTab === "pacientes" ? <PatientsTab patients={patients} /> : null}
      {activeTab === "rotas" ? (
        <RoutesTab
          role={user.role}
          routeSchedules={routeSchedules}
          routes={routes}
          token={token}
          trips={trips}
        />
      ) : null}
      {activeTab === "relatorios" ? <ReportsTab trips={trips} /> : null}
    </DashboardShell>
  );
}

function PanelTab({
  bookings,
  home,
  onPatientSearch,
  onTripDateChange,
  patientSearch,
  patients,
  role,
  tripDate,
  trips,
}: {
  bookings: Booking[];
  home: RoleHome;
  onPatientSearch: (value: string) => void;
  onTripDateChange: (value: string) => void;
  patientSearch: string;
  patients: Patient[];
  role: AuthenticatedUser["role"];
  tripDate: string;
  trips: DashboardTrip[];
}) {
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
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-500">Filtro</p>
          <h2 className="mt-1 text-base font-semibold text-zinc-900">
            Viagens por data
          </h2>
        </div>
        <button
          className="h-10 rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold transition hover:bg-zinc-50"
          onClick={() => onDateChange(getTodayIsoDate())}
          type="button"
        >
          Hoje
        </button>
      </div>

      <label className="mt-4 block text-sm font-medium text-zinc-700">
        Data da viagem
        <input
          className="mt-2 h-12 w-full rounded-md border border-zinc-300 px-4 text-base outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
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
