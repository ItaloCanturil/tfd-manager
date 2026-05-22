import { Button } from "@/components/ui/button";

export function PatientModalShell({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-background/40 px-4 py-8 backdrop-blur-sm">
      <section className="max-h-full w-full max-w-3xl overflow-auto rounded-[calc(var(--radius)*5)] border border-border/70 bg-card/95 p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Pacientes
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight">
              {title}
            </h2>
          </div>
          <Button onClick={onClose} type="button" variant="outline">
            Fechar
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}

export function PatientFormFooter({
  error,
  isSaving,
  onClose,
  savingLabel,
  submitLabel,
}: {
  error: string;
  isSaving: boolean;
  onClose: () => void;
  savingLabel: string;
  submitLabel: string;
}) {
  return (
    <>
      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      <div className="mt-6 flex justify-end gap-3">
        <Button onClick={onClose} type="button" variant="outline">
          Cancelar
        </Button>
        <Button disabled={isSaving} type="submit">
          {isSaving ? savingLabel : submitLabel}
        </Button>
      </div>
    </>
  );
}

export function TextField({
  label,
  onChange,
  required = false,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <label className="block text-sm font-medium text-foreground">
      {label}
      <input
        className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

export function SelectField({
  disabled = false,
  label,
  onChange,
  options,
  value,
}: {
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <label className="block text-sm font-medium text-foreground">
      {label}
      <select
        className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        required
        value={value}
      >
        {options.map((option) => (
          <option key={`${option.value}-${option.label}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CheckboxField({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex min-h-10 items-center gap-3 rounded-lg border border-border bg-muted/35 px-3 text-sm font-medium text-foreground">
      <input
        checked={checked}
        className="h-4 w-4 accent-[hsl(var(--primary))]"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      {label}
    </label>
  );
}
