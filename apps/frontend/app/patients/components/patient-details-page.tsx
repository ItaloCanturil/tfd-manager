"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/app/page-shell";
import { clearAccessToken, readAccessToken, saveAccessToken } from "../../lib/auth-session";
import {
  apiUrl,
  createBooking,
  getCurrentUser,
  getPatientByCpf,
  listActiveTrips,
  listBookingsByPatient,
  updatePatient,
  type AuthenticatedUser,
  type Booking,
  type Patient,
  type Trip,
  type UpdatePatientInput,
} from "../../lib/tfd-api";
import { PatientBookingModal, type PatientBookingForm } from "./patient-booking-modal";
import { PatientDetailsContent } from "./patient-details-content";
import { PatientEditModal } from "./patient-edit-modal";

type LoadState =
  | { status: "loading"; error: ""; patient: null }
  | { status: "error"; error: string; patient: null }
  | { status: "ready"; error: ""; patient: Patient };

type PatientForm = UpdatePatientInput;

export function PatientDetailsPage({ cpf }: { cpf: string }) {
  const router = useRouter();
  const decodedCpf = useMemo(() => decodeURIComponent(cpf), [cpf]);
  const [session, setSession] = useState<AuthenticatedUser | null>(null);
  const [loadState, setLoadState] = useState<LoadState>({
    error: "",
    patient: null,
    status: "loading",
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [editError, setEditError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [isSavingPatient, setIsSavingPatient] = useState(false);
  const [isSavingBooking, setIsSavingBooking] = useState(false);

  const refreshPatient = useCallback(
    async (token: string) => {
      const patient = await getPatientByCpf(token, decodedCpf);
      const [patientBookings, activeTrips] = await Promise.all([
        listBookingsByPatient(token, patient.id),
        listActiveTrips(token),
      ]);

      setLoadState({ error: "", patient, status: "ready" });
      setBookings(
        [...patientBookings].sort((a: Booking, b: Booking) =>
          b.appointmentDate.localeCompare(a.appointmentDate),
        ),
      );
      setTrips(activeTrips);
    },
    [decodedCpf],
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
        return refreshPatient(token);
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar o paciente.";

        if (message.toLowerCase().includes("unauthorized")) {
          clearAccessToken();
          router.replace("/login");
          return;
        }

        setLoadState({ error: message, patient: null, status: "error" });
      });
  }, [refreshPatient, router]);

  function handleSignOut() {
    clearAccessToken();
    router.replace("/login");
    router.refresh();
  }

  async function handlePatientSubmit(
    patientId: string,
    form: PatientForm,
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const token = readAccessToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setEditError("");
    setIsSavingPatient(true);

    try {
      const updatedPatient = await updatePatient(token, patientId, form);
      setLoadState({ error: "", patient: updatedPatient, status: "ready" });
      setIsEditOpen(false);
      router.replace(`/patients/${encodeURIComponent(updatedPatient.cpf)}`);
    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : "Nao foi possivel atualizar o paciente.",
      );
    } finally {
      setIsSavingPatient(false);
    }
  }

  async function handleBookingSubmit(
    patientId: string,
    form: PatientBookingForm,
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const token = readAccessToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setBookingError("");
    setIsSavingBooking(true);

    try {
      await createBooking(token, {
        appointmentDate: form.appointmentDate,
        companionCpf: cleanOptional(form.companionCpf),
        companionName: cleanOptional(form.companionName),
        companionSus: cleanOptional(form.companionSus),
        finalDestination: form.finalDestination,
        hasCompanion: form.hasCompanion,
        patientId,
        tripId: form.tripId,
      });
      await refreshPatient(token);
      setIsBookingOpen(false);
    } catch (error) {
      setBookingError(
        error instanceof Error
          ? error.message
          : "Nao foi possivel criar o agendamento.",
      );
    } finally {
      setIsSavingBooking(false);
    }
  }

  if (loadState.status === "loading") {
    return (
      <PageShell onSignOut={handleSignOut} session={session} title="Paciente">
        <section className="rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-medium text-muted-foreground">
            Carregando dados do paciente em {apiUrl}.
          </p>
        </section>
      </PageShell>
    );
  }

  if (loadState.status === "error") {
    return (
      <PageShell onSignOut={handleSignOut} session={session} title="Paciente">
        <section className="rounded-[calc(var(--radius)*4)] border border-destructive/30 bg-card/95 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold text-destructive">Paciente</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            Nao encontrado
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            {loadState.error}
          </p>
          <Button
            className="mt-5"
            onClick={() => router.push("/dashboard")}
            type="button"
            variant="outline"
          >
            Voltar ao dashboard
          </Button>
        </section>
      </PageShell>
    );
  }

  const { patient } = loadState;

  return (
    <PageShell
      contentClassName="space-y-6"
      onSignOut={handleSignOut}
      session={session}
      title={patient.name}
    >
      <PatientDetailsContent
        bookings={bookings}
        onCreateBooking={() => setIsBookingOpen(true)}
        onEditPatient={() => setIsEditOpen(true)}
        patient={patient}
        trips={trips}
      />

      {isEditOpen ? (
        <PatientEditModal
          error={editError}
          isSaving={isSavingPatient}
          onClose={() => setIsEditOpen(false)}
          onSubmit={(form, event) => handlePatientSubmit(patient.id, form, event)}
          patient={patient}
        />
      ) : null}

      {isBookingOpen ? (
        <PatientBookingModal
          error={bookingError}
          isSaving={isSavingBooking}
          onClose={() => setIsBookingOpen(false)}
          onSubmit={(form, event) => handleBookingSubmit(patient.id, form, event)}
          trips={trips}
        />
      ) : null}
    </PageShell>
  );
}

function cleanOptional(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(value),
  );
}
