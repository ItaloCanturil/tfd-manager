import type {
  Booking,
  Route,
  RouteSchedule,
  Trip,
} from "../../lib/tfd-api";
import type { UserRole } from "../../lib/tfd-api";

export type RoleHome = {
  accent: string;
  focus: string;
  summary: string;
  title: string;
};

export type DashboardTab = "painel" | "pacientes" | "rotas" | "relatorios";

export const dashboardTabs: { id: DashboardTab; label: string }[] = [
  { id: "painel", label: "Painel" },
  { id: "pacientes", label: "Pacientes" },
  { id: "rotas", label: "Rotas" },
  { id: "relatorios", label: "Relatorios" },
];

export const roleHome: Record<UserRole, RoleHome> = {
  COORDINATOR: {
    accent: "border-l-emerald-600",
    focus: "Operacao geral",
    summary:
      "Visao para acompanhar capacidade, equipes e indicadores do Tratamento Fora do Domicilio.",
    title: "Central de coordenacao",
  },
  RECEPTIONIST: {
    accent: "border-l-sky-600",
    focus: "Atendimento",
    summary:
      "Fluxo inicial voltado para cadastro, consulta obrigatoria e reserva de vagas por paciente.",
    title: "Mesa da recepcao",
  },
  TRANSPORT: {
    accent: "border-l-amber-600",
    focus: "Logistica",
    summary:
      "Painel para acompanhar saidas, lotacao e manifestos das viagens ativas.",
    title: "Operacao de transporte",
  },
};

export type DashboardTrip = Pick<
  Trip,
  | "capacity"
  | "departureDate"
  | "id"
  | "name"
  | "routeId"
  | "routeScheduleId"
  | "status"
>;

export type DashboardBooking = Pick<
  Booking,
  "appointmentDate" | "finalDestination"
>;

export type DashboardRoute = Pick<Route, "destination" | "id">;

export type DashboardRouteSchedule = Pick<
  RouteSchedule,
  | "defaultCapacity"
  | "departureTime"
  | "id"
  | "isActive"
  | "label"
  | "routeId"
  | "weekdays"
>;

export const fallbackTrips: DashboardTrip[] = [
  {
    capacity: 24,
    departureDate: new Date().toISOString().slice(0, 10),
    id: "juazeiro-petrolina",
    name: "Juazeiro / Petrolina",
    routeId: "juazeiro-petrolina",
    routeScheduleId: "juazeiro-petrolina-manha",
    status: "ACTIVE",
  },
  {
    capacity: 27,
    departureDate: new Date().toISOString().slice(0, 10),
    id: "salvador",
    name: "Salvador",
    routeId: "salvador",
    routeScheduleId: "salvador-padrao",
    status: "ACTIVE",
  },
];
