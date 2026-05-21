export function PatientSearch({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block rounded-[calc(var(--radius)*4)] border border-border/70 bg-card/90 p-5 shadow-sm backdrop-blur">
      <span className="text-sm font-semibold text-muted-foreground">
        Buscar paciente
      </span>
      <input
        className="mt-3 h-12 w-full rounded-lg border border-input bg-background px-4 text-base outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nome, CPF ou cartao SUS"
        type="text"
        value={value}
      />
    </label>
  );
}
