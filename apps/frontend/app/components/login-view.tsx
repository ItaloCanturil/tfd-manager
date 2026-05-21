import { Button } from "@/components/ui/button";

import type { UserRole } from "../lib/tfd-api";

const roleLabels: Record<UserRole, string> = {
  COORDINATOR: "Coordenador",
  RECEPTIONIST: "Recepcionista",
  TRANSPORT: "Transporte",
};

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

type LoginViewProps = {
  apiUrl: string;
  error: string | null;
  isSubmitting: boolean;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onUsernameChange: (value: string) => void;
  password: string;
  username: string;
};

export function LoginView({
  apiUrl,
  error,
  isSubmitting,
  onPasswordChange,
  onSubmit,
  onUsernameChange,
  password,
  username,
}: LoginViewProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_30%),linear-gradient(180deg,hsl(var(--muted)/0.35),transparent_40%)] text-foreground">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1.15fr)_440px] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Tratamento Fora do Domicilio
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Acesso operacional do TFD
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Entre com uma conta ativa para carregar a sessao no backend e abrir
            a navegacao correta para coordenacao, recepcao ou transporte.
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
                <p className="text-sm font-semibold">
                  {roleLabels[profile.role]}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {profile.focus}
                </p>
              </div>
            ))}
          </div>
        </div>

        <form
          className="rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/95 p-6 shadow-xl backdrop-blur"
          onSubmit={onSubmit}
        >
          <div>
            <p className="text-sm font-medium text-muted-foreground">Login</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight">
              Entrar no sistema
            </h2>
          </div>

          <label className="mt-6 block text-sm font-medium text-foreground">
            Usuario
            <input
              autoComplete="username"
              className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-base outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              onChange={(event) => onUsernameChange(event.target.value)}
              placeholder="Digite seu usuario"
              required
              type="text"
              value={username}
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-foreground">
            Senha
            <input
              autoComplete="current-password"
              className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-base outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              onChange={(event) => onPasswordChange(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {error ? (
            <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button
            className="mt-6 h-11 w-full text-sm font-semibold"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>

          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            API conectada em {apiUrl}. O token recebido e validado em /auth/me
            antes de abrir a area interna.
          </p>
        </form>
      </section>
    </main>
  );
}
