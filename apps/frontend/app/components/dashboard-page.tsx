"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearAccessToken,
  readAccessToken,
  saveAccessToken,
} from "../lib/auth-session";
import {
  apiUrl,
  getCurrentUser,
  type AuthenticatedUser,
  type UserRole,
} from "../lib/tfd-api";

const roleLabels: Record<UserRole, string> = {
  COORDINATOR: "Coordenador",
  RECEPTIONIST: "Recepcionista",
  TRANSPORT: "Transporte",
};

const roleHome: Record<
  UserRole,
  {
    accent: string;
    focus: string;
    nav: string[];
    summary: string;
    title: string;
  }
> = {
  COORDINATOR: {
    accent: "border-l-emerald-600",
    focus: "Operacao geral",
    nav: ["Painel", "Usuarios", "Rotas", "Relatorios"],
    summary:
      "Visao para acompanhar capacidade, equipes e indicadores do Tratamento Fora do Domicilio.",
    title: "Central de coordenacao",
  },
  RECEPTIONIST: {
    accent: "border-l-sky-600",
    focus: "Atendimento",
    nav: ["Agenda", "Pacientes", "Reservas", "Consultas"],
    summary:
      "Fluxo inicial voltado para cadastro, consulta obrigatoria e reserva de vagas por paciente.",
    title: "Mesa da recepcao",
  },
  TRANSPORT: {
    accent: "border-l-amber-600",
    focus: "Logistica",
    nav: ["Viagens", "Passageiros", "Rotas", "Ocorrencias"],
    summary:
      "Painel para acompanhar saidas, lotacao e manifestos das viagens ativas.",
    title: "Operacao de transporte",
  },
};

type SessionState =
  | { status: "checking"; user: null }
  | { status: "authenticated"; user: AuthenticatedUser };

export function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState>({
    status: "checking",
    user: null,
  });

  useEffect(() => {
    const token = readAccessToken();

    if (!token) {
      clearAccessToken();
      router.replace("/login");
      return;
    }

    getCurrentUser(token)
      .then((user) => {
        saveAccessToken(token);
        setSession({ status: "authenticated", user });
      })
      .catch(() => {
        clearAccessToken();
        router.replace("/login");
      });
  }, [router]);

  function handleSignOut() {
    clearAccessToken();
    router.replace("/login");
    router.refresh();
  }

  if (session.status === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-6 text-zinc-950">
        <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">TFD</p>
          <h1 className="mt-2 text-2xl font-semibold">Abrindo dashboard</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Validando a sessao atual com o backend em {apiUrl}.
          </p>
        </div>
      </main>
    );
  }

  return <RoleDashboard onSignOut={handleSignOut} user={session.user} />;
}

function RoleDashboard({
  onSignOut,
  user,
}: {
  onSignOut: () => void;
  user: AuthenticatedUser;
}) {
  const home = roleHome[user.role];
  const [patientSearch, setPatientSearch] = useState("");
  const initials = useMemo(
    () =>
      user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join(""),
    [user.name],
  );

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              TFD
            </p>
            <h1 className="text-2xl font-semibold">{home.title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white">
                {initials || "TF"}
              </span>
              <span>
                <span className="block text-sm font-semibold">{user.name}</span>
                <span className="block text-xs text-zinc-500">
                  {roleLabels[user.role]} - {user.username}
                </span>
              </span>
            </div>
            <button
              className="h-10 rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold transition hover:bg-zinc-50"
              onClick={onSignOut}
              type="button"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[240px_1fr]">
        <nav className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
          {home.nav.map((item, index) => (
            <a
              className={`block rounded-md px-3 py-2 text-sm font-medium ${
                index === 0
                  ? "bg-zinc-950 text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              }`}
              href="#"
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>

        <section className="space-y-6">
          <div
            className={`rounded-lg border border-l-4 border-zinc-200 bg-white p-6 shadow-sm ${home.accent}`}
          >
            <p className="text-sm font-semibold text-zinc-500">
              {roleLabels[user.role]}
            </p>
            <h2 className="mt-2 text-3xl font-semibold">{home.focus}</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
              {home.summary}
            </p>
          </div>

          <div className="grid auto-rows-[minmax(120px,auto)] gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <div className="space-y-4">
              <PatientSearch
                onChange={setPatientSearch}
                value={patientSearch}
              />
              <JuazeiroPetrolinaTrip patientSearch={patientSearch} />
            </div>

            <ActionPanel role={user.role} />
          </div>

          <DashboardMetrics role={user.role} />
        </section>
      </div>
    </main>
  );
}

function PatientSearch({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <span className="text-sm font-semibold text-zinc-500">
        Buscar paciente
      </span>
      <input
        className="mt-3 h-12 w-full rounded-md border border-zinc-300 px-4 text-base outline-none transition placeholder:text-zinc-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nome, CPF ou cartao SUS"
        type="text"
        value={value}
      />
    </label>
  );
}

function JuazeiroPetrolinaTrip({ patientSearch }: { patientSearch: string }) {
  const passengerPreview = patientSearch.trim()
    ? `Filtro ativo: ${patientSearch.trim()}`
    : "Nenhum paciente filtrado";

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Viagem ativa</p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight">
            Juazeiro / Petrolina
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Saida organizada para atendimento regional, com controle de
            assentos, acompanhantes e conferencia de embarque.
          </p>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          18 de 24 vagas
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Saida", "05:30"],
          ["Retorno", "16:00"],
          ["Pacientes", "18 confirmados"],
        ].map(([label, value]) => (
          <div
            className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
            key={label}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {label}
            </p>
            <p className="mt-2 text-lg font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4">
        <p className="text-sm font-semibold text-zinc-700">
          {passengerPreview}
        </p>
        <p className="mt-1 text-sm leading-6 text-zinc-500">
          A busca ja esta posicionada para conectar com a lista de pacientes e
          reservas da viagem.
        </p>
      </div>
    </article>
  );
}

function ActionPanel({ role }: { role: UserRole }) {
  const actions = [
    "Criar paciente",
    "Imprimir planilha",
    "Novo agendamento",
    ...(role === "COORDINATOR" ? ["Criar conta"] : []),
  ];

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-zinc-500">Acoes rapidas</p>
        <h2 className="mt-2 text-xl font-semibold">Atalhos do painel</h2>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            className="min-h-28 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left text-sm font-semibold transition hover:border-zinc-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            key={action}
            type="button"
          >
            {action}
          </button>
        ))}
      </div>
    </section>
  );
}

function DashboardMetrics({ role }: { role: UserRole }) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {[
        ["Hoje", "3 viagens", "lg:col-span-1"],
        ["Ocupacao", "76%", "lg:col-span-1"],
        [
          "Pendencias",
          role === "TRANSPORT" ? "2 embarques" : "5 cadastros",
          "lg:col-span-1",
        ],
        ["Perfil", roleLabels[role], "lg:col-span-1"],
      ].map(([label, value, span]) => (
        <div
          className={`rounded-lg border border-zinc-200 bg-white p-5 shadow-sm ${span}`}
          key={label}
        >
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-2 break-words text-2xl font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
}
