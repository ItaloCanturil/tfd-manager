import { roleLabels } from "@/app/lib/role-labels";
import type { UserRole } from "../../lib/tfd-api";

const loginProfiles: Array<{
  accent: string;
  focus: string;
  role: UserRole;
}> = [
  {
    accent: "from-primary/20 via-primary/5 to-transparent",
    focus: "Operacao geral",
    role: "COORDINATOR",
  },
  {
    accent: "from-secondary/25 via-secondary/5 to-transparent",
    focus: "Atendimento",
    role: "RECEPTIONIST",
  },
  {
    accent: "from-chart-3/25 via-chart-3/5 to-transparent",
    focus: "Logistica",
    role: "TRANSPORT",
  },
];

export function LoginHero() {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
        Tratamento Fora do Domicilio
      </p>
      <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
        Acesso operacional do TFD
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
        Entre com uma conta ativa para carregar a sessao no backend e abrir a
        navegacao correta para coordenacao, recepcao ou transporte.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {loginProfiles.map((profile) => (
          <div
            className="overflow-hidden rounded-2xl border border-border/70 bg-card/90 p-4 shadow-sm backdrop-blur"
            key={profile.role}
          >
            <div
              aria-hidden="true"
              className={`mb-4 h-1 w-full rounded-full bg-gradient-to-r ${profile.accent}`}
            />
            <p className="text-sm font-semibold">{roleLabels[profile.role]}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {profile.focus}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
