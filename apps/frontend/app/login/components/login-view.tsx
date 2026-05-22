import { LoginForm } from "./login-form";
import { LoginHero } from "./login-hero";

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
        <LoginHero />
        <LoginForm
          apiUrl={apiUrl}
          error={error}
          isSubmitting={isSubmitting}
          onPasswordChange={onPasswordChange}
          onSubmit={onSubmit}
          onUsernameChange={onUsernameChange}
          password={password}
          username={username}
        />
      </section>
    </main>
  );
}
