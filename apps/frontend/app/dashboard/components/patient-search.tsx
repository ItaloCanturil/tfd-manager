export function PatientSearch({
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
