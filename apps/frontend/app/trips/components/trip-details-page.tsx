"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/app/page-shell";
import { clearAccessToken, readAccessToken, saveAccessToken } from "../../lib/auth-session";
import {
  getCurrentUser,
  getTripById,
  listBookingsByTrip,
  listPatients,
  listRouteSchedules,
  listRoutes,
  type AuthenticatedUser,
  type Booking,
  type Patient,
  type Route,
  type RouteSchedule,
  type Trip,
} from "../../lib/tfd-api";
import { TripDetailsContent } from "./trip-details-content";

type TripDetailsState =
  | { status: "loading"; error: ""; payload: null }
  | { status: "error"; error: string; payload: null }
  | {
      status: "ready";
      error: "";
      payload: {
        bookings: Booking[];
        patients: Patient[];
        route: Route | null;
        schedule: RouteSchedule | null;
        trip: Trip;
      };
    };

export function TripDetailsPage({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<AuthenticatedUser | null>(null);
  const [state, setState] = useState<TripDetailsState>({
    error: "",
    payload: null,
    status: "loading",
  });

  const loadTrip = useCallback(
    async (token: string) => {
      const [trip, bookings, patients, routes, schedules] = await Promise.all([
        getTripById(token, tripId),
        listBookingsByTrip(token, tripId),
        listPatients(token),
        listRoutes(token),
        listRouteSchedules(token),
      ]);

      setState({
        error: "",
        payload: {
          bookings: [...bookings].sort((firstBooking, secondBooking) => {
            const byAppointment = firstBooking.appointmentDate.localeCompare(
              secondBooking.appointmentDate,
            );

            if (byAppointment !== 0) {
              return byAppointment;
            }

            return firstBooking.finalDestination.localeCompare(
              secondBooking.finalDestination,
              "pt-BR",
              { sensitivity: "base" },
            );
          }),
          patients,
          route: routes.find((item) => item.id === trip.routeId) ?? null,
          schedule:
            schedules.find((item) => item.id === trip.routeScheduleId) ?? null,
          trip,
        },
        status: "ready",
      });
    },
    [tripId],
  );

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
        setSession(user);
        return loadTrip(token);
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar a viagem.";

        if (message.toLowerCase().includes("unauthorized")) {
          clearAccessToken();
          router.replace("/login");
          return;
        }

        setState({ error: message, payload: null, status: "error" });
      });
  }, [loadTrip, router]);

  function handleSignOut() {
    clearAccessToken();
    router.replace("/login");
    router.refresh();
  }

  if (state.status === "loading") {
    return (
      <PageShell onSignOut={handleSignOut} session={session} title="Viagem">
        <section className="rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-medium text-muted-foreground">
            Carregando detalhes da viagem.
          </p>
        </section>
      </PageShell>
    );
  }

  if (state.status === "error") {
    return (
      <PageShell onSignOut={handleSignOut} session={session} title="Viagem">
        <section className="rounded-[calc(var(--radius)*4)] border border-destructive/30 bg-card/95 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold text-destructive">Viagem</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            Nao encontrada
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            {state.error}
          </p>
        </section>
      </PageShell>
    );
  }

  const { bookings, patients, route, schedule, trip } = state.payload;

  return (
    <PageShell onSignOut={handleSignOut} session={session} title={trip.name}>
      <TripDetailsContent
        bookings={bookings}
        patients={patients}
        route={route}
        schedule={schedule}
        trip={trip}
      />
    </PageShell>
  );
}
