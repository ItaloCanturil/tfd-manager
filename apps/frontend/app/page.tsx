const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-6 py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            Tratamento Fora do Domicilio
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
            Controle de vagas por viagem, rota e paciente.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            Base inicial do sistema TFD com frontend Next.js, API NestJS,
            PostgreSQL, Prisma, Docker Compose e workspace Turborepo.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Pacientes", "Cadastro, documentos e historico de viagens."],
            ["Rotas e viagens", "Capacidade, destino final e cancelamentos."],
            ["Reservas", "Consulta obrigatoria, acompanhante e status."],
          ].map(([title, description]) => (
            <article
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              key={title}
            >
              <h2 className="text-base font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </article>
          ))}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
          API configurada em{" "}
          <code className="rounded bg-slate-100 px-2 py-1 text-slate-950">
            {apiUrl}
          </code>
        </div>
      </section>
    </main>
  );
}
