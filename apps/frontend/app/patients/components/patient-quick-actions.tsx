export function PatientQuickActions({
  onCreateBooking,
  onEditPatient,
}: {
  onCreateBooking: () => void;
  onEditPatient: () => void;
}) {
  return (
    <aside className="rounded-[calc(var(--radius)*4)] border border-border bg-background/70 p-5">
      <p className="text-sm font-semibold text-muted-foreground">Atendimento</p>
      <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight">
        Acoes rapidas
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Atualize o cadastro ou reserve uma nova vaga sem sair da pagina.
      </p>
      <div className="mt-5 grid gap-3">
        <button
          className="rounded-[calc(var(--radius)*3)] border border-primary/20 bg-primary/10 p-4 text-left text-sm font-semibold text-primary transition hover:bg-primary/15"
          onClick={onCreateBooking}
          type="button"
        >
          Criar novo agendamento
        </button>
        <button
          className="rounded-[calc(var(--radius)*3)] border border-border bg-muted/40 p-4 text-left text-sm font-semibold text-foreground transition hover:bg-accent"
          onClick={onEditPatient}
          type="button"
        >
          Editar informacoes do paciente
        </button>
      </div>
    </aside>
  );
}
