import type { Patient } from "../../lib/tfd-api";

export function PatientsTab({ patients }: { patients: Patient[] }) {
  const orderedPatients = [...patients].sort((first, second) =>
    first.name.localeCompare(second.name, "pt-BR", { sensitivity: "base" }),
  );

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-500">Pacientes</p>
          <h2 className="mt-2 text-3xl font-semibold">Lista de pacientes</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
            Pacientes cadastrados em ordem alfabetica para consulta rapida.
          </p>
        </div>
        <span className="w-fit rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {orderedPatients.length} paciente
          {orderedPatients.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-zinc-100 text-xs uppercase tracking-wide text-zinc-600">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">CPF</th>
              <th className="px-4 py-3">Cartao SUS</th>
              <th className="px-4 py-3">Nascimento</th>
              <th className="px-4 py-3">Contato</th>
            </tr>
          </thead>
          <tbody>
            {orderedPatients.length > 0 ? (
              orderedPatients.map((patient) => (
                <tr className="border-t border-zinc-200" key={patient.id}>
                  <td className="px-4 py-3 font-medium">
                    <a
                      className="transition hover:text-emerald-700"
                      href={`/patients/${encodeURIComponent(patient.cpf)}`}
                    >
                      {patient.name}
                    </a>
                  </td>
                  <td className="px-4 py-3">{patient.cpf}</td>
                  <td className="px-4 py-3">{patient.susCard}</td>
                  <td className="px-4 py-3">{formatDate(patient.birthDate)}</td>
                  <td className="px-4 py-3">{patient.phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-zinc-600" colSpan={5}>
                  Nenhum paciente cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(value),
  );
}
