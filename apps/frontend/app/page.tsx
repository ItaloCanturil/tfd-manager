import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard");
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
              <span className="text-xs text-zinc-600">{trip.seats} vagas</span>
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
          <InfoItem label="Nascimento" value={formatDate(patient.birthDate)} />
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
