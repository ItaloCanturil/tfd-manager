"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  clearAccessToken,
  readAccessToken,
  saveAccessToken,
} from "../lib/auth-session";
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
} from "../lib/tfd-api";

type LoadState =
  | { status: "loading"; error: ""; patient: null }
  | { status: "error"; error: string; patient: null }
  | { status: "ready"; error: ""; patient: Patient };

type PatientForm = UpdatePatientInput;

type BookingForm = {
  appointmentDate: string;
  companionCpf: string;
  companionName: string;
  companionSus: string;
  finalDestination: string;
  hasCompanion: boolean;
  tripId: string;
};

const statusLabels: Record<Booking["status"], string> = {
  ABSENT: "Ausente",
  CANCELED: "Cancelada",
  CONFIRMED: "Confirmada",
};

const emptyBookingForm: BookingForm = {
  appointmentDate: "",
  companionCpf: "",
  companionName: "",
  companionSus: "",
  finalDestination: "",
  hasCompanion: false,
  tripId: "",
};

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
    form: BookingForm,
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
      <Shell session={session} onSignOut={handleSignOut} title="Paciente" />
    );
  }

  if (loadState.status === "error") {
    return (
      <Shell session={session} onSignOut={handleSignOut} title="Paciente">
        <section className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-red-700">Paciente</p>
          <h1 className="mt-2 text-2xl font-semibold">Nao encontrado</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {loadState.error}
          </p>
          <button
            className="mt-5 h-10 rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold transition hover:bg-zinc-50"
            onClick={() => router.push("/dashboard")}
            type="button"
          >
            Voltar ao painel
          </button>
        </section>
      </Shell>
    );
  }

  const { patient } = loadState;

  return (
    <Shell session={session} onSignOut={handleSignOut} title={patient.name}>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">Paciente</p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight">
                {patient.name}
              </h1>
              <p className="mt-2 text-sm text-zinc-500">
                Cadastro atualizado em {formatDateTime(patient.updatedAt)}
              </p>
            </div>
            <span className="w-fit rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
              {bookings.length} agendamento{bookings.length === 1 ? "" : "s"}
            </span>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="CPF" value={patient.cpf} />
            <InfoItem label="Cartao SUS" value={patient.susCard} />
            <InfoItem label="RG" value={patient.rg} />
            <InfoItem label="Contato" value={patient.phone} />
            <InfoItem
              label="Nascimento"
              value={formatDate(patient.birthDate)}
            />
            <InfoItem label="ID do cadastro" value={patient.id} />
            <InfoItem
              label="Criado em"
              value={formatDateTime(patient.createdAt)}
            />
            <InfoItem
              label="Atualizado em"
              value={formatDateTime(patient.updatedAt)}
            />
          </dl>
        </section>

        <QuickActions
          onCreateBooking={() => setIsBookingOpen(true)}
          onEditPatient={() => setIsEditOpen(true)}
        />
      </div>

      <BookingsGrid bookings={bookings} trips={trips} />

      {isEditOpen ? (
        <PatientEditModal
          error={editError}
          isSaving={isSavingPatient}
          onClose={() => setIsEditOpen(false)}
          onSubmit={(form, event) =>
            handlePatientSubmit(patient.id, form, event)
          }
          patient={patient}
        />
      ) : null}

      {isBookingOpen ? (
        <BookingModal
          error={bookingError}
          isSaving={isSavingBooking}
          onClose={() => setIsBookingOpen(false)}
          onSubmit={(form, event) =>
            handleBookingSubmit(patient.id, form, event)
          }
          trips={trips}
        />
      ) : null}
    </Shell>
  );
}

function Shell({
  children,
  onSignOut,
  session,
  title,
}: {
  children?: React.ReactNode;
  onSignOut: () => void;
  session: AuthenticatedUser | null;
  title: string;
}) {
  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <a
              className="text-sm font-semibold uppercase tracking-wide text-emerald-700"
              href="/dashboard"
            >
              TFD
            </a>
            <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {session ? (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                <span className="block text-sm font-semibold">
                  {session.name}
                </span>
                <span className="block text-xs text-zinc-500">
                  {session.username}
                </span>
              </div>
            ) : null}
            <button
              className="h-10 rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold transition hover:bg-zinc-50"
              onClick={onSignOut}
              type="button"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl space-y-6 px-6 py-6">
        {children ?? (
          <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">
              Carregando dados em {apiUrl}.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

function QuickActions({
  onCreateBooking,
  onEditPatient,
}: {
  onCreateBooking: () => void;
  onEditPatient: () => void;
}) {
  return (
    <aside className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-zinc-500">Acoes rapidas</p>
      <h2 className="mt-2 text-xl font-semibold">Atendimento</h2>
      <div className="mt-5 grid gap-3">
        <button
          className="min-h-20 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-left text-sm font-semibold text-emerald-900 transition hover:border-emerald-500 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
          onClick={onCreateBooking}
          type="button"
        >
          Criar novo agendamento
        </button>
        <button
          className="min-h-20 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left text-sm font-semibold transition hover:border-zinc-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
          onClick={onEditPatient}
          type="button"
        >
          Editar informacoes do paciente
        </button>
      </div>
    </aside>
  );
}

function BookingsGrid({
  bookings,
  trips,
}: {
  bookings: Booking[];
  trips: Trip[];
}) {
  const tripById = new Map(trips.map((trip) => [trip.id, trip]));

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-500">Agendamentos</p>
          <h2 className="mt-2 text-2xl font-semibold">Reservas do paciente</h2>
        </div>
        <p className="text-sm text-zinc-500">{bookings.length} registro(s)</p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const trip = tripById.get(booking.tripId);

            return (
              <article
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                key={booking.id}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {booking.finalDestination}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      Consulta em {formatDate(booking.appointmentDate)}
                    </p>
                  </div>
                  <span className={statusClassName(booking.status)}>
                    {statusLabels[booking.status]}
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <InfoItem
                    label="Viagem"
                    value={trip ? trip.name : booking.tripId}
                  />
                  <InfoItem
                    label="Saida"
                    value={
                      trip ? formatDate(trip.departureDate) : "Nao informada"
                    }
                  />
                  <InfoItem
                    label="Acompanhante"
                    value={booking.hasCompanion ? "Sim" : "Nao"}
                  />
                  <InfoItem
                    label="Nome acompanhante"
                    value={booking.companionName ?? "Nao informado"}
                  />
                  <InfoItem
                    label="SUS acompanhante"
                    value={booking.companionSus ?? "Nao informado"}
                  />
                  <InfoItem
                    label="CPF acompanhante"
                    value={booking.companionCpf ?? "Nao informado"}
                  />
                </dl>
              </article>
            );
          })
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600 lg:col-span-2">
            Nenhum agendamento encontrado para este paciente.
          </div>
        )}
      </div>
    </section>
  );
}

function PatientEditModal({
  error,
  isSaving,
  onClose,
  onSubmit,
  patient,
}: {
  error: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (
    form: PatientForm,
    event: FormEvent<HTMLFormElement>,
  ) => Promise<void>;
  patient: Patient;
}) {
  const [form, setForm] = useState<PatientForm>({
    birthDate: patient.birthDate,
    cpf: patient.cpf,
    name: patient.name,
    phone: patient.phone,
    rg: patient.rg,
    susCard: patient.susCard,
  });

  function updateField(field: keyof PatientForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <Modal title="Editar paciente" onClose={onClose}>
      <form onSubmit={(event) => onSubmit(form, event)}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Nome"
            onChange={(value) => updateField("name", value)}
            required
            value={form.name}
          />
          <TextField
            label="Data de nascimento"
            onChange={(value) => updateField("birthDate", value)}
            required
            type="date"
            value={form.birthDate}
          />
          <TextField
            label="CPF"
            onChange={(value) => updateField("cpf", value)}
            required
            value={form.cpf}
          />
          <TextField
            label="Cartao SUS"
            onChange={(value) => updateField("susCard", value)}
            required
            value={form.susCard}
          />
          <TextField
            label="RG"
            onChange={(value) => updateField("rg", value)}
            required
            value={form.rg}
          />
          <TextField
            label="Contato"
            onChange={(value) => updateField("phone", value)}
            required
            value={form.phone}
          />
        </div>
        <FormFooter
          error={error}
          isSaving={isSaving}
          onClose={onClose}
          savingLabel="Salvando..."
          submitLabel="Salvar paciente"
        />
      </form>
    </Modal>
  );
}

function BookingModal({
  error,
  isSaving,
  onClose,
  onSubmit,
  trips,
}: {
  error: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (
    form: BookingForm,
    event: FormEvent<HTMLFormElement>,
  ) => Promise<void>;
  trips: Trip[];
}) {
  const firstTripId = trips[0]?.id ?? "";
  const [form, setForm] = useState<BookingForm>({
    ...emptyBookingForm,
    tripId: firstTripId,
  });

  function updateField(field: keyof BookingForm, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <Modal title="Criar agendamento" onClose={onClose}>
      <form onSubmit={(event) => onSubmit(form, event)}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium">
            Viagem
            <select
              className="mt-2 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-700"
              disabled={trips.length === 0}
              onChange={(event) => updateField("tripId", event.target.value)}
              required
              value={form.tripId}
            >
              {trips.length > 0 ? (
                trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.name} - {formatDate(trip.departureDate)}
                  </option>
                ))
              ) : (
                <option value="">Nenhuma viagem ativa</option>
              )}
            </select>
          </label>
          <TextField
            label="Destino final"
            onChange={(value) => updateField("finalDestination", value)}
            required
            value={form.finalDestination}
          />
          <TextField
            label="Data da consulta"
            onChange={(value) => updateField("appointmentDate", value)}
            required
            type="date"
            value={form.appointmentDate}
          />
          <label className="flex h-full min-h-16 items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-medium">
            <input
              checked={form.hasCompanion}
              className="h-4 w-4 accent-emerald-700"
              onChange={(event) =>
                updateField("hasCompanion", event.target.checked)
              }
              type="checkbox"
            />
            Possui acompanhante
          </label>
          <TextField
            label="Nome acompanhante"
            onChange={(value) => updateField("companionName", value)}
            value={form.companionName}
          />
          <TextField
            label="SUS acompanhante"
            onChange={(value) => updateField("companionSus", value)}
            value={form.companionSus}
          />
          <TextField
            label="CPF acompanhante"
            onChange={(value) => updateField("companionCpf", value)}
            value={form.companionCpf}
          />
        </div>
        <FormFooter
          error={error}
          isSaving={isSaving || trips.length === 0}
          onClose={onClose}
          savingLabel="Criando..."
          submitLabel="Criar agendamento"
        />
      </form>
    </Modal>
  );
}

function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-zinc-950/45 px-4 py-8">
      <section className="max-h-full w-full max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Pacientes
            </p>
            <h2 className="mt-2 text-xl font-semibold">{title}</h2>
          </div>
          <button
            className="h-9 rounded-md border border-zinc-300 px-3 text-sm font-medium"
            onClick={onClose}
            type="button"
          >
            Fechar
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function FormFooter({
  error,
  isSaving,
  onClose,
  savingLabel,
  submitLabel,
}: {
  error: string;
  isSaving: boolean;
  onClose: () => void;
  savingLabel: string;
  submitLabel: string;
}) {
  return (
    <>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <div className="mt-6 flex justify-end gap-3">
        <button
          className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-medium"
          onClick={onClose}
          type="button"
        >
          Cancelar
        </button>
        <button
          className="h-10 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? savingLabel : submitLabel}
        </button>
      </div>
    </>
  );
}

function TextField({
  label,
  onChange,
  required = false,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        className="mt-2 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-700"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 break-words font-medium">{value}</dd>
    </div>
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusClassName(status: Booking["status"]) {
  const base =
    "w-fit rounded-md border px-3 py-1 text-xs font-semibold uppercase tracking-wide";

  if (status === "CONFIRMED") {
    return `${base} border-emerald-200 bg-emerald-50 text-emerald-800`;
  }

  if (status === "ABSENT") {
    return `${base} border-amber-200 bg-amber-50 text-amber-800`;
  }

  return `${base} border-zinc-300 bg-zinc-100 text-zinc-700`;
}
