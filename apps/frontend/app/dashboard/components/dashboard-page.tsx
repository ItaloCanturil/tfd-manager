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
  getCurrentUser,
  listActiveTrips,
  listPatients,
  type AuthenticatedUser,
  type Patient,
} from "../../lib/tfd-api";
import { ActionPanel } from "./action-panel";
import { DashboardMetrics } from "./dashboard-metrics";
import {
  fallbackTrips,
  roleHome,
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
        ]);
      })
      .then(([trips, patientList]) => {
        setActiveTrips(trips);
        setPatients(patientList);
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
      trips={activeTrips.length > 0 ? activeTrips : fallbackTrips}
      user={session.user}
    />
  );
}

function RoleDashboard({
  onSignOut,
  patients,
  trips,
  user,
}: {
  onSignOut: () => void;
  patients: Patient[];
  trips: DashboardTrip[];
  user: AuthenticatedUser;
}) {
  const home = roleHome[user.role];
  const [activeTab, setActiveTab] = useState<DashboardTab>("painel");
  const [patientSearch, setPatientSearch] = useState("");

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
          patientSearch={patientSearch}
          role={user.role}
          trips={trips}
        />
      ) : null}
      {activeTab === "pacientes" ? <PatientsTab patients={patients} /> : null}
      {activeTab === "rotas" ? <RoutesTab trips={trips} /> : null}
      {activeTab === "relatorios" ? <ReportsTab trips={trips} /> : null}
    </DashboardShell>
  );
}

function PanelTab({
  home,
  onPatientSearch,
  patientSearch,
  role,
  trips,
}: {
  home: RoleHome;
  onPatientSearch: (value: string) => void;
  patientSearch: string;
  role: AuthenticatedUser["role"];
  trips: DashboardTrip[];
}) {
  return (
    <>
      <RoleSummary home={home} role={role} />

      <div className="grid auto-rows-[minmax(120px,auto)] gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div className="space-y-4">
          <PatientSearch onChange={onPatientSearch} value={patientSearch} />
          <TripsByLocation patientSearch={patientSearch} trips={trips} />
        </div>

        <ActionPanel role={role} />
      </div>

      <DashboardMetrics role={role} />
    </>
  );
}
