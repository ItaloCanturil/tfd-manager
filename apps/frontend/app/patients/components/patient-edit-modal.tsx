import type { FormEvent } from "react";
import { useState } from "react";
import type { Patient, UpdatePatientInput } from "../../lib/tfd-api";
import {
  PatientFormFooter,
  PatientModalShell,
  TextField,
} from "./patient-modal-shell";

type PatientForm = UpdatePatientInput;

export function PatientEditModal({
  error,
  isSaving,
  onClose,
  onSubmit,
  patient,
}: {
  error: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (
    form: PatientForm,
    event: FormEvent<HTMLFormElement>,
  ) => Promise<void>;
  patient: Patient;
}) {
  const [form, setForm] = useState<PatientForm>({
    birthDate: patient.birthDate,
    cpf: patient.cpf,
    name: patient.name,
    phone: patient.phone,
    rg: patient.rg,
    susCard: patient.susCard,
  });

  function updateField(field: keyof PatientForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <PatientModalShell onClose={onClose} title="Editar paciente">
      <form onSubmit={(event) => onSubmit(form, event)}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Nome" onChange={(value) => updateField("name", value)} required value={form.name} />
          <TextField
            label="Data de nascimento"
            onChange={(value) => updateField("birthDate", value)}
            required
            type="date"
            value={form.birthDate}
          />
          <TextField label="CPF" onChange={(value) => updateField("cpf", value)} required value={form.cpf} />
          <TextField
            label="Cartao SUS"
            onChange={(value) => updateField("susCard", value)}
            required
            value={form.susCard}
          />
          <TextField label="RG" onChange={(value) => updateField("rg", value)} required value={form.rg} />
          <TextField
            label="Contato"
            onChange={(value) => updateField("phone", value)}
            required
            value={form.phone}
          />
        </div>
        <PatientFormFooter
          error={error}
          isSaving={isSaving}
          onClose={onClose}
          savingLabel="Salvando..."
          submitLabel="Salvar paciente"
        />
      </form>
    </PatientModalShell>
  );
}
