import type { Patient } from "../../lib/tfd-api";

export function PatientsTab({ patients }: { patients: Patient[] }) {
  const orderedPatients = [...patients].sort((first, second) =>
    first.name.localeCompare(second.name, "pt-BR", { sensitivity: "base" }),
  );

  return (
    <section className="rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Pacientes
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            Lista de pacientes
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Pacientes cadastrados em ordem alfabetica para consulta rapida.
          </p>
        </div>
        <span className="w-fit rounded-full border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
          {orderedPatients.length} paciente
          {orderedPatients.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground">
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
                <tr className="border-t border-border" key={patient.id}>
                  <td className="px-4 py-3 font-medium">
                    <a
                      className="transition hover:text-primary"
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
                <td className="px-4 py-6 text-muted-foreground" colSpan={5}>
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
