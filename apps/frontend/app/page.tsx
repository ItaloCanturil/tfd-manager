"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Patient = {
  id: string;
  name: string;
  cpf: string;
  susCard: string;
  birthDate: string;
  rg: string;
  phone: string;
};

type Booking = {
  id: string;
  patientId: string;
  tripId: string;
  finalDestination: string;
  appointmentDate: string;
  hasCompanion: boolean;
  status: "CONFIRMED" | "ABSENT" | "CANCELED";
};

type Trip = {
  id: string;
  name: string;
  departureDate: string;
  capacity: number;
  status: "ACTIVE" | "CANCELED";
};

type PatientForm = {
  name: string;
  address: string;
  birthDate: string;
  susCard: string;
  rg: string;
  cpf: string;
  phone: string;
};

const emptyPatientForm: PatientForm = {
  name: "",
  address: "",
  birthDate: "",
  susCard: "",
  rg: "",
  cpf: "",
  phone: "",
};

const sampleTrips = [
  { destination: "Juazeiro/Petrolina", seats: 18, date: "Hoje" },
  { destination: "Salvador", seats: 12, date: "Hoje" },
];

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value: string) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [searchCpf, setSearchCpf] = useState("");
  const [searchError, setSearchError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientForm, setPatientForm] = useState<PatientForm>(emptyPatientForm);
  const [isSavingPatient, setIsSavingPatient] = useState(false);
  const [patientError, setPatientError] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token],
  );

  useEffect(() => {
    const storedToken = window.localStorage.getItem("tfd.token");
    const storedUser = window.localStorage.getItem("tfd.user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser) as User);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    void fetch(`${apiUrl}/trips?date=${todayIsoDate()}&status=ACTIVE`, {
      headers: authHeaders,
    })
      .then((response) => (response.ok ? response.json() : []))
      .then((data: Trip[]) => setTrips(Array.isArray(data) ? data : []))
      .catch(() => setTrips([]));
  }, [authHeaders, token]);

  useEffect(() => {
    if (!token || !selectedPatient) {
      setBookings([]);
      return;
    }

    void fetch(`${apiUrl}/bookings?patientId=${selectedPatient.id}`, {
      headers: authHeaders,
    })
      .then((response) => (response.ok ? response.json() : []))
      .then((data: Booking[]) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]));
  }, [authHeaders, selectedPatient, token]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setLoginError("Email ou senha invalidos.");
      setIsLoggingIn(false);
      return;
    }

    const data = (await response.json()) as { accessToken: string; user: User };
    window.localStorage.setItem("tfd.token", data.accessToken);
    window.localStorage.setItem("tfd.user", JSON.stringify(data.user));
    setToken(data.accessToken);
    setUser(data.user);
    setIsLoggingIn(false);
  }

  function handleLogout() {
    window.localStorage.removeItem("tfd.token");
    window.localStorage.removeItem("tfd.user");
    setToken(null);
    setUser(null);
    setSelectedPatient(null);
  }

  async function handlePatientSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchError("");

    const cpf = searchCpf.replace(/\D/g, "");
    const response = await fetch(`${apiUrl}/patients/cpf/${cpf}`, {
      headers: authHeaders,
    });

    if (!response.ok) {
      setSearchError("Paciente nao encontrado.");
      return;
    }

    setSelectedPatient((await response.json()) as Patient);
  }

  async function handleCreatePatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingPatient(true);
    setPatientError("");

    const response = await fetch(`${apiUrl}/patients`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: patientForm.name,
        cpf: patientForm.cpf.replace(/\D/g, ""),
        susCard: patientForm.susCard.replace(/\D/g, ""),
        birthDate: patientForm.birthDate,
        rg: patientForm.rg,
        phone: patientForm.phone,
      }),
    });

    if (!response.ok) {
      setPatientError("Nao foi possivel criar o paciente.");
      setIsSavingPatient(false);
      return;
    }

    const createdPatient = (await response.json()) as Patient;
    setSelectedPatient(createdPatient);
    setPatientForm(emptyPatientForm);
    setIsPatientModalOpen(false);
    setIsSavingPatient(false);
  }

  if (!token || !user) {
    return (
      <main className="min-h-screen bg-stone-100 text-zinc-950">
        <section className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-12">
          <form
            className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
            onSubmit={handleLogin}
          >
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Sistema TFD
              </p>
              <h1 className="mt-3 text-2xl font-semibold">
                Entrar no painel
              </h1>
            </div>

            <label className="block text-sm font-medium" htmlFor="email">
              Login
            </label>
            <input
              className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-700"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@exemplo.com"
              required
              type="email"
              value={email}
            />

            <label className="mt-5 block text-sm font-medium" htmlFor="senha">
              Senha
            </label>
            <input
              className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-700"
              id="senha"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />

            {loginError ? (
              <p className="mt-4 text-sm text-red-700">{loginError}</p>
            ) : null}

            <button
              className="mt-6 h-11 w-full rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
              disabled={isLoggingIn}
              type="submit"
            >
              {isLoggingIn ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-100 text-zinc-950">
      <section className="mx-auto min-h-screen w-full max-w-7xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Tratamento Fora do Domicilio
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Painel de controle</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-zinc-600">{user.name}</span>
            <button
              className="h-10 rounded-md border border-zinc-300 px-4 font-medium"
              onClick={handleLogout}
              type="button"
            >
              Sair
            </button>
          </div>
        </header>

        {selectedPatient ? (
          <PatientPage
            bookings={bookings}
            onBack={() => setSelectedPatient(null)}
            patient={selectedPatient}
          />
        ) : (
          <Dashboard
            onCreatePatient={() => setIsPatientModalOpen(true)}
            onSearch={handlePatientSearch}
            searchCpf={searchCpf}
            searchError={searchError}
            setSearchCpf={setSearchCpf}
            trips={trips}
          />
        )}
      </section>

      {isPatientModalOpen ? (
        <PatientModal
          error={patientError}
          form={patientForm}
          isSaving={isSavingPatient}
          onChange={setPatientForm}
          onClose={() => setIsPatientModalOpen(false)}
          onSubmit={handleCreatePatient}
        />
      ) : null}
    </main>
  );
}

function Dashboard({
  onCreatePatient,
  onSearch,
  searchCpf,
  searchError,
  setSearchCpf,
  trips,
}: {
  onCreatePatient: () => void;
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
  searchCpf: string;
  searchError: string;
  setSearchCpf: (value: string) => void;
  trips: Trip[];
}) {
  const visibleTrips =
    trips.length > 0
      ? trips.map((trip) => ({
          date: formatDate(trip.departureDate),
          destination: trip.name,
          seats: trip.capacity,
        }))
      : sampleTrips;

  return (
    <div className="pt-10">
      <form
        className="mx-auto flex w-full max-w-2xl flex-wrap items-start justify-center gap-3"
        onSubmit={onSearch}
      >
        <div className="min-w-64 flex-1">
          <input
            className="h-10 w-full rounded-md border border-zinc-400 bg-white px-4 text-center text-sm outline-none focus:border-emerald-700"
            onChange={(event) => setSearchCpf(event.target.value)}
            placeholder="buscar paciente por CPF"
            value={searchCpf}
          />
          {searchError ? (
            <p className="mt-2 text-sm text-red-700">{searchError}</p>
          ) : null}
        </div>
        <button
          className="h-10 rounded-md border border-zinc-400 bg-white px-4 text-sm font-medium"
          type="button"
        >
          Filtros
        </button>
        <button
          className="h-10 rounded-md border border-emerald-700 bg-white px-4 text-sm font-semibold text-emerald-800"
          onClick={onCreatePatient}
          type="button"
        >
          Criar novo paciente
        </button>
      </form>

      <section className="mt-14 rounded-lg border border-zinc-400 bg-white px-6 py-8">
        <h2 className="text-center text-sm font-semibold text-zinc-700">
          Viagens de hoje
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {visibleTrips.map((trip) => (
            <article
              className="mx-auto flex min-h-72 w-full max-w-56 flex-col justify-between rounded-lg border border-zinc-500 p-5 text-center"
              key={`${trip.destination}-${trip.date}`}
            >
              <span className="text-xs font-medium text-zinc-500">
                {trip.date}
              </span>
              <strong className="text-sm">{trip.destination}</strong>
              <span className="text-xs text-zinc-600">
                {trip.seats} vagas
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function PatientModal({
  error,
  form,
  isSaving,
  onChange,
  onClose,
  onSubmit,
}: {
  error: string;
  form: PatientForm;
  isSaving: boolean;
  onChange: (form: PatientForm) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  function updateField(field: keyof PatientForm, value: string) {
    onChange({ ...form, [field]: value });
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-zinc-950/45 px-4 py-8">
      <form
        className="max-h-full w-full max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-xl"
        onSubmit={onSubmit}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Pacientes
            </p>
            <h2 className="mt-2 text-xl font-semibold">Criar paciente</h2>
          </div>
          <button
            className="h-9 rounded-md border border-zinc-300 px-3 text-sm font-medium"
            onClick={onClose}
            type="button"
          >
            Fechar
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <TextField
            label="Nome"
            onChange={(value) => updateField("name", value)}
            required
            value={form.name}
          />
          <TextField
            label="Endereco"
            onChange={(value) => updateField("address", value)}
            value={form.address}
          />
          <TextField
            label="Data nascimento"
            onChange={(value) => updateField("birthDate", value)}
            required
            type="date"
            value={form.birthDate}
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
            label="CPF"
            onChange={(value) => updateField("cpf", value)}
            required
            value={form.cpf}
          />
          <TextField
            label="Contato"
            onChange={(value) => updateField("phone", value)}
            required
            value={form.phone}
          />
        </div>

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
            {isSaving ? "Salvando..." : "Salvar paciente"}
          </button>
        </div>
      </form>
    </div>
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

function PatientPage({
  bookings,
  onBack,
  patient,
}: {
  bookings: Booking[];
  onBack: () => void;
  patient: Patient;
}) {
  return (
    <div className="pt-8">
      <button
        className="h-10 rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium"
        onClick={onBack}
        type="button"
      >
        Voltar
      </button>

      <section className="mt-6 rounded-lg border border-zinc-300 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Paciente
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{patient.name}</h2>
          </div>
          <button
            className="h-10 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white"
            type="button"
          >
            Adicionar viagem
          </button>
        </div>

        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="CPF" value={patient.cpf} />
          <InfoItem label="Cartao SUS" value={patient.susCard} />
          <InfoItem label="RG" value={patient.rg} />
          <InfoItem label="Contato" value={patient.phone} />
          <InfoItem
            label="Nascimento"
            value={formatDate(patient.birthDate)}
          />
        </dl>
      </section>

      <section className="mt-6 rounded-lg border border-zinc-300 bg-white p-6">
        <h3 className="text-lg font-semibold">Viagens anteriores</h3>
        <div className="mt-4 overflow-hidden rounded-md border border-zinc-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-stone-100 text-xs uppercase tracking-wide text-zinc-600">
              <tr>
                <th className="px-4 py-3">Destino</th>
                <th className="px-4 py-3">Consulta</th>
                <th className="px-4 py-3">Acompanhante</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr className="border-t border-zinc-200" key={booking.id}>
                    <td className="px-4 py-3">{booking.finalDestination}</td>
                    <td className="px-4 py-3">
                      {formatDate(booking.appointmentDate)}
                    </td>
                    <td className="px-4 py-3">
                      {booking.hasCompanion ? "Sim" : "Nao"}
                    </td>
                    <td className="px-4 py-3">{booking.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6 text-zinc-600" colSpan={4}>
                    Nenhuma viagem encontrada para este paciente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
