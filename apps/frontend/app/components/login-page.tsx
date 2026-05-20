"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveAccessToken } from "../lib/auth-session";
import { apiUrl, login, type UserRole } from "../lib/tfd-api";

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
    accent: "border-l-emerald-600",
    focus: "Operacao geral",
    role: "COORDINATOR",
  },
  {
    accent: "border-l-sky-600",
    focus: "Atendimento",
    role: "RECEPTIONIST",
  },
  {
    accent: "border-l-amber-600",
    focus: "Logistica",
    role: "TRANSPORT",
  },
];

export function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await login(username, password);
      saveAccessToken(response.accessToken);
      setPassword("");
      router.replace("/dashboard");
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Nao foi possivel entrar no sistema.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Tratamento Fora do Domicilio
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            Acesso operacional do TFD
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-700">
            Entre com uma conta ativa para carregar a sessao no backend e abrir
            a navegacao correta para coordenacao, recepcao ou transporte.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {loginProfiles.map((profile) => (
              <div
                className={`rounded-lg border border-l-4 border-zinc-200 bg-white p-4 shadow-sm ${profile.accent}`}
                key={profile.role}
              >
                <p className="text-sm font-semibold">
                  {roleLabels[profile.role]}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {profile.focus}
                </p>
              </div>
            ))}
          </div>
        </div>

        <form
          className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
          onSubmit={handleSubmit}
        >
          <div>
            <p className="text-sm font-medium text-zinc-500">Login</p>
            <h2 className="mt-2 text-2xl font-semibold">Entrar no sistema</h2>
          </div>

          <label className="mt-6 block text-sm font-medium text-zinc-700">
            Usuario
            <input
              autoComplete="username"
              className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-base outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Digite seu usuario"
              required
              type="text"
              value={username}
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-zinc-700">
            Senha
            <input
              autoComplete="current-password"
              className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-base outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {error ? (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            className="mt-6 h-11 w-full rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>

          <p className="mt-4 text-xs leading-5 text-zinc-500">
            API conectada em {apiUrl}. O token recebido e validado em /auth/me
            antes de abrir a area interna.
          </p>
        </form>
      </section>
    </main>
  );
}
