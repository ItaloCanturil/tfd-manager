"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createTrip,
  type CreateTripInput,
  type Route,
  type RouteSchedule,
  type UserRole,
} from "../../lib/tfd-api";
import { CreateRouteDialog } from "./create-route-dialog";
import type {
  DashboardRoute,
  DashboardRouteSchedule,
  DashboardTrip,
} from "./dashboard-config";

type RoutesTabProps = {
  role: UserRole;
  routeSchedules: DashboardRouteSchedule[];
  routes: DashboardRoute[];
  token: string;
  trips: DashboardTrip[];
};

type NewTripForm = {
  capacity: string;
  departureDate: string;
  name: string;
  notes: string;
};

const weekdayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

export function RoutesTab({
  role,
  routeSchedules,
  routes,
  token,
  trips,
}: RoutesTabProps) {
  const [expandedRouteId, setExpandedRouteId] = useState(routes[0]?.id ?? "");
  const [managedRoutes, setManagedRoutes] = useState(routes);
  const [managedSchedules, setManagedSchedules] = useState(routeSchedules);
  const [managedTrips, setManagedTrips] = useState(trips);
  const [isCreateRouteOpen, setIsCreateRouteOpen] = useState(false);
  const [formScheduleId, setFormScheduleId] = useState<string | null>(null);
  const [form, setForm] = useState<NewTripForm>({
    capacity: "",
    departureDate: "",
    name: "",
    notes: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setManagedTrips(trips);
  }, [trips]);

  useEffect(() => {
    setManagedRoutes(routes);
  }, [routes]);

  useEffect(() => {
    setManagedSchedules(routeSchedules);
  }, [routeSchedules]);

  useEffect(() => {
    if (!expandedRouteId && managedRoutes[0]) {
      setExpandedRouteId(managedRoutes[0].id);
    }
  }, [expandedRouteId, managedRoutes]);

  const schedulesByRoute = useMemo(() => {
    const grouped = new Map<string, DashboardRouteSchedule[]>();

    for (const schedule of managedSchedules) {
      const routeSchedulesForRoute = grouped.get(schedule.routeId) ?? [];
      routeSchedulesForRoute.push(schedule);
      grouped.set(schedule.routeId, routeSchedulesForRoute);
    }

    for (const routeSchedulesForRoute of grouped.values()) {
      routeSchedulesForRoute.sort((firstSchedule, secondSchedule) =>
        firstSchedule.departureTime.localeCompare(secondSchedule.departureTime),
      );
    }

    return grouped;
  }, [managedSchedules]);

  const upcomingTripsBySchedule = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const grouped = new Map<string, DashboardTrip[]>();

    for (const trip of managedTrips) {
      if (trip.departureDate < today) {
        continue;
      }

      const scheduleTrips = grouped.get(trip.routeScheduleId) ?? [];
      scheduleTrips.push(trip);
      grouped.set(trip.routeScheduleId, scheduleTrips);
    }

    for (const scheduleTrips of grouped.values()) {
      scheduleTrips.sort((firstTrip, secondTrip) =>
        firstTrip.departureDate.localeCompare(secondTrip.departureDate),
      );
    }

    return grouped;
  }, [managedTrips]);

  function handleOpenForm(schedule: DashboardRouteSchedule) {
    setMessage(null);
    setFormScheduleId(schedule.id);
    setForm({
      capacity: String(schedule.defaultCapacity),
      departureDate: getNextRouteDate(schedule.weekdays),
      name: "",
      notes: "",
    });
  }

  function handleRouteCreated(route: Route, schedules: RouteSchedule[]) {
    setManagedRoutes((currentRoutes) => [...currentRoutes, route]);
    setManagedSchedules((currentSchedules) => [
      ...currentSchedules,
      ...schedules,
    ]);
    setExpandedRouteId(route.id);
    setMessage("Rota criada com sucesso.");
  }

  async function handleCreateTrip(
    route: DashboardRoute,
    schedule: DashboardRouteSchedule,
  ) {
    if (!form.departureDate) {
      setMessage("Informe a data da viagem.");
      return;
    }

    setIsSaving(true);
    setMessage(null);

    const payload: CreateTripInput = {
      departureDate: form.departureDate,
      routeScheduleId: schedule.id,
    };

    if (form.capacity) {
      payload.capacity = Number(form.capacity);
    }

    if (form.name.trim()) {
      payload.name = form.name.trim();
    } else {
      payload.name = `${route.destination} - ${schedule.label}`;
    }

    if (form.notes.trim()) {
      payload.notes = form.notes.trim();
    }

    try {
      const createdTrip = await createTrip(token, payload);
      setManagedTrips((currentTrips) => [...currentTrips, createdTrip]);
      setFormScheduleId(null);
      setMessage("Viagem criada com sucesso.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Nao foi possivel criar a viagem.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Rotas</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            Locais atendidos
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Visao das rotas, saidas recorrentes e proximas viagens por
            localidade.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {role === "COORDINATOR" ? (
            <button
              className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              onClick={() => {
                setMessage(null);
                setIsCreateRouteOpen(true);
              }}
              type="button"
            >
              Criar rota
            </button>
          ) : null}
          <span className="w-fit rounded-full border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
            {managedRoutes.length} rota{managedRoutes.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {isCreateRouteOpen ? (
        <CreateRouteDialog
          onClose={() => setIsCreateRouteOpen(false)}
          onCreated={handleRouteCreated}
          token={token}
        />
      ) : null}

      {message ? (
        <p className="mt-4 rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm font-medium text-foreground">
          {message}
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        {managedRoutes.length === 0 ? (
          <p className="rounded-2xl border border-border bg-muted/50 px-4 py-5 text-sm text-muted-foreground">
            Nenhuma rota cadastrada. Cadastre as rotas fixas antes de criar
            viagens.
          </p>
        ) : null}

        {managedRoutes.map((route) => {
          const isExpanded = expandedRouteId === route.id;
          const schedules = schedulesByRoute.get(route.id) ?? [];
          const upcomingTripsCount = schedules.reduce(
            (sum, schedule) =>
              sum + (upcomingTripsBySchedule.get(schedule.id)?.length ?? 0),
            0,
          );

          return (
            <article
              className="overflow-hidden rounded-2xl border border-border"
              key={route.id}
            >
              <button
                aria-expanded={isExpanded}
                className="flex w-full flex-col gap-3 bg-muted/40 px-4 py-4 text-left transition hover:bg-accent md:flex-row md:items-center md:justify-between"
                onClick={() =>
                  setExpandedRouteId(isExpanded ? "" : route.id)
                }
                type="button"
              >
                <span>
                  <span className="block text-base font-semibold text-foreground">
                    {route.destination}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {schedules.length} saida{schedules.length === 1 ? "" : "s"}{" "}
                    recorrente{schedules.length === 1 ? "" : "s"}
                  </span>
                </span>
                <span className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                  {upcomingTripsCount} proxima
                  {upcomingTripsCount === 1 ? "" : "s"}
                  <span aria-hidden="true">{isExpanded ? "^" : "v"}</span>
                </span>
              </button>

              {isExpanded ? (
                <div className="space-y-5 px-4 py-5">
                  <div className="grid gap-3 md:grid-cols-3">
                    <RouteMetric
                      label="Saidas recorrentes"
                      value={String(schedules.length)}
                    />
                    <RouteMetric
                      label="Capacidade total"
                      value={`${schedules.reduce(
                        (sum, schedule) => sum + schedule.defaultCapacity,
                        0,
                      )} vagas/dia`}
                    />
                    <RouteMetric
                      label="Proximas viagens"
                      value={String(upcomingTripsCount)}
                    />
                  </div>

                  {schedules.length === 0 ? (
                    <p className="rounded-2xl border border-border bg-muted/50 px-4 py-5 text-sm text-muted-foreground">
                      Nenhuma saida recorrente cadastrada para esta rota.
                    </p>
                  ) : null}

                  {schedules.map((schedule) => {
                    const upcomingTrips =
                      upcomingTripsBySchedule.get(schedule.id) ?? [];

                    return (
                      <div
                        className="rounded-2xl border border-border p-4"
                        key={schedule.id}
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-foreground">
                              {schedule.label} -{" "}
                              {formatTime(schedule.departureTime)}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {formatWeekdays(schedule.weekdays)} -{" "}
                              {schedule.defaultCapacity} vagas padrao
                            </p>
                          </div>
                          {role === "COORDINATOR" ? (
                            <button
                              className="w-fit rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                              disabled={isSaving}
                              onClick={() => handleOpenForm(schedule)}
                              type="button"
                            >
                              Criar nova viagem
                            </button>
                          ) : null}
                        </div>

                        {formScheduleId === schedule.id ? (
                          <div className="mt-4 grid gap-3 rounded-2xl border border-border bg-muted/50 p-4 md:grid-cols-[1fr_1fr]">
                            <label className="text-sm font-medium text-foreground">
                              Data
                              <input
                                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                                onChange={(event) =>
                                  setForm((currentForm) => ({
                                    ...currentForm,
                                    departureDate: event.target.value,
                                  }))
                                }
                                type="date"
                                value={form.departureDate}
                              />
                            </label>
                            <label className="text-sm font-medium text-foreground">
                              Capacidade
                              <input
                                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                                min="1"
                                onChange={(event) =>
                                  setForm((currentForm) => ({
                                    ...currentForm,
                                    capacity: event.target.value,
                                  }))
                                }
                                type="number"
                                value={form.capacity}
                              />
                            </label>
                            <label className="text-sm font-medium text-foreground">
                              Nome
                              <input
                                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                                onChange={(event) =>
                                  setForm((currentForm) => ({
                                    ...currentForm,
                                    name: event.target.value,
                                  }))
                                }
                                placeholder={`${route.destination} - ${schedule.label}`}
                                type="text"
                                value={form.name}
                              />
                            </label>
                            <label className="text-sm font-medium text-foreground">
                              Observacoes
                              <input
                                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                                onChange={(event) =>
                                  setForm((currentForm) => ({
                                    ...currentForm,
                                    notes: event.target.value,
                                  }))
                                }
                                type="text"
                                value={form.notes}
                              />
                            </label>
                            <div className="flex gap-2 md:col-span-2">
                              <button
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={isSaving}
                                onClick={() => handleCreateTrip(route, schedule)}
                                type="button"
                              >
                                Salvar viagem
                              </button>
                              <button
                                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-accent"
                                disabled={isSaving}
                                onClick={() => setFormScheduleId(null)}
                                type="button"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : null}

                        <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                          {upcomingTrips.length > 0 ? (
                            <table className="w-full min-w-[560px] text-left text-sm">
                              <thead className="bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                  <th className="px-4 py-3">Viagem</th>
                                  <th className="px-4 py-3">Saida</th>
                                  <th className="px-4 py-3">Capacidade</th>
                                  <th className="px-4 py-3">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {upcomingTrips.slice(0, 5).map((trip) => (
                                  <tr
                                    className="border-t border-border"
                                    key={trip.id}
                                  >
                                    <td className="px-4 py-3 font-medium">
                                      {trip.name}
                                    </td>
                                    <td className="px-4 py-3">
                                      {formatDate(trip.departureDate)}
                                    </td>
                                    <td className="px-4 py-3">
                                      {trip.capacity} vagas
                                    </td>
                                    <td className="px-4 py-3">
                                      {trip.status}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="bg-muted/50 px-4 py-5 text-sm text-muted-foreground">
                              Nenhuma viagem futura cadastrada para esta saida.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RouteMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
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

function formatWeekdays(weekdays: number[]) {
  return [...weekdays]
    .sort((firstWeekday, secondWeekday) => firstWeekday - secondWeekday)
    .map((weekday) => weekdayLabels[weekday] ?? String(weekday))
    .join(", ");
}

function getNextRouteDate(weekdays: number[]) {
  const validWeekdays = new Set(weekdays);
  const currentDate = new Date();

  for (let offset = 0; offset < 14; offset += 1) {
    const candidate = new Date(currentDate);
    candidate.setDate(currentDate.getDate() + offset);

    if (validWeekdays.has(candidate.getDay())) {
      return candidate.toISOString().slice(0, 10);
    }
  }

  return currentDate.toISOString().slice(0, 10);
}
