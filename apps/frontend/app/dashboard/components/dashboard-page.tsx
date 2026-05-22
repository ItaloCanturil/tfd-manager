"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  clearAccessToken,
  readAccessToken,
  saveAccessToken,
} from "../../lib/auth-session";
import {
  apiUrl,
  getCurrentUser,
  listActiveTrips,
  listPatients,
  listRouteSchedules,
  listRoutes,
  type AuthenticatedUser,
  type Patient,
} from "../../lib/tfd-api";
import {
  fallbackTrips,
  roleHome,
  type DashboardRoute,
  type DashboardRouteSchedule,
  type DashboardTab,
  type DashboardTrip,
} from "./dashboard-config";
import { DashboardPanelSkeleton } from "./dashboard-panel-skeleton";
import { DashboardShell } from "./dashboard-shell";

const PanelTabContainer = dynamic(
  () =>
    import("./panel-tab-container").then((module) => ({
      default: module.PanelTabContainer,
    })),
  { loading: () => <DashboardPanelSkeleton /> },
);

const PatientsTab = dynamic(
  () =>
    import("./patients-tab").then((module) => ({
      default: module.PatientsTab,
    })),
  { loading: () => <DashboardPanelSkeleton /> },
);

const ReportsTab = dynamic(
  () =>
    import("./reports-tab").then((module) => ({
      default: module.ReportsTab,
    })),
  { loading: () => <DashboardPanelSkeleton /> },
);

const RoutesTab = dynamic(
  () =>
    import("./routes-tab").then((module) => ({
      default: module.RoutesTab,
    })),
  { loading: () => <DashboardPanelSkeleton /> },
);

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
      <main className="min-h-screen bg-[linear-gradient(180deg,hsl(var(--muted)/0.5),transparent_26%),radial-gradient(circle_at_top_right,hsl(var(--primary)/0.16),transparent_28%)] px-6 py-12 text-foreground">
        <div className="mx-auto w-full max-w-md rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/95 p-6 shadow-xl backdrop-blur">
          <p className="text-sm font-medium text-muted-foreground">TFD</p>
          <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight">
            Abrindo dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
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

  return (
    <DashboardShell
      activeTab={activeTab}
      home={home}
      onSelectTab={setActiveTab}
      onSignOut={onSignOut}
      user={user}
    >
      {activeTab === "painel" ? (
        <PanelTabContainer
          home={home}
          onPatientSearch={setPatientSearch}
          onTripDateChange={setTripDate}
          patientSearch={patientSearch}
          patients={patients}
          role={user.role}
          token={token}
          tripDate={tripDate}
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

function getTodayIsoDate() {
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 10);
}
