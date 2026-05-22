import Link from "next/link";
import { CalendarDays, FileText, Phone, ShieldPlus, UserRoundPen } from "lucide-react";
import { HeroMetric } from "@/components/app/hero-metric";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Patient } from "../../lib/tfd-api";

export function PatientHeader({
  bookingCount,
  onCreateBooking,
  onEditPatient,
  patient,
}: {
  bookingCount: number;
  onCreateBooking: () => void;
  onEditPatient: () => void;
  patient: Patient;
}) {
  return (
    <div className="border-b border-border/70 bg-[linear-gradient(135deg,hsl(var(--primary)/0.15),transparent_55%),linear-gradient(180deg,hsl(var(--muted)/0.55),transparent)] px-6 py-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Paciente
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground">
            {patient.name}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Cadastro atualizado em {formatDateTime(patient.updatedAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            {bookingCount} agendamento{bookingCount === 1 ? "" : "s"}
          </span>
          <Button onClick={onEditPatient} type="button" variant="outline">
            <UserRoundPen className="size-4" />
            Editar cadastro
          </Button>
          <Button onClick={onCreateBooking} type="button">
            <CalendarDays className="size-4" />
            Novo agendamento
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <HeroMetric
          icon={<ShieldPlus className="size-4" />}
          label="Cartao SUS"
          value={patient.susCard}
        />
        <HeroMetric icon={<FileText className="size-4" />} label="CPF" value={patient.cpf} />
        <HeroMetric icon={<Phone className="size-4" />} label="Contato" value={patient.phone} />
        <HeroMetric
          icon={<CalendarDays className="size-4" />}
          label="Nascimento"
          value={formatDate(patient.birthDate)}
        />
      </div>

      <div className="mt-5">
        <Link
          className={cn(buttonVariants({ variant: "outline" }))}
          href="/dashboard"
        >
          Voltar ao dashboard
        </Link>
      </div>
    </div>
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
