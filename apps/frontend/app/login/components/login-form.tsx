import { Button } from "@/components/ui/button";

export function LoginForm({
  apiUrl,
  error,
  isSubmitting,
  onPasswordChange,
  onSubmit,
  onUsernameChange,
  password,
  username,
}: {
  apiUrl: string;
  error: string | null;
  isSubmitting: boolean;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onUsernameChange: (value: string) => void;
  password: string;
  username: string;
}) {
  return (
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
  );
}
