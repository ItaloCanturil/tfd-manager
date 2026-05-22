import { InfoCard } from "@/components/app/info-card";
import type { Patient } from "../../lib/tfd-api";

export function PatientOverviewCard({ patient }: { patient: Patient }) {
  return (
    <section className="rounded-[calc(var(--radius)*4)] border border-border bg-background/70 p-5">
      <div>
        <p className="text-sm font-semibold text-muted-foreground">Cadastro</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight">
          Dados do paciente
        </h2>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <InfoCard label="CPF" value={patient.cpf} />
        <InfoCard label="Cartao SUS" value={patient.susCard} />
        <InfoCard label="RG" value={patient.rg} />
        <InfoCard label="Contato" value={patient.phone} />
        <InfoCard label="Nascimento" value={formatDate(patient.birthDate)} />
        <InfoCard label="ID do cadastro" value={patient.id} />
        <InfoCard label="Criado em" value={formatDateTime(patient.createdAt)} />
        <InfoCard
          label="Atualizado em"
          value={formatDateTime(patient.updatedAt)}
        />
      </dl>
    </section>
  );
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
