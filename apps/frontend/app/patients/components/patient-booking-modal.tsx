import type { FormEvent } from "react";
import { useState } from "react";
import type { Trip } from "../../lib/tfd-api";
import {
  CheckboxField,
  PatientFormFooter,
  PatientModalShell,
  SelectField,
  TextField,
} from "./patient-modal-shell";

export type PatientBookingForm = {
  appointmentDate: string;
  companionCpf: string;
  companionName: string;
  companionSus: string;
  finalDestination: string;
  hasCompanion: boolean;
  tripId: string;
};

const emptyBookingForm: PatientBookingForm = {
  appointmentDate: "",
  companionCpf: "",
  companionName: "",
  companionSus: "",
  finalDestination: "",
  hasCompanion: false,
  tripId: "",
};

export function PatientBookingModal({
  error,
  isSaving,
  onClose,
  onSubmit,
  trips,
}: {
  error: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (
    form: PatientBookingForm,
    event: FormEvent<HTMLFormElement>,
  ) => Promise<void>;
  trips: Trip[];
}) {
  const firstTripId = trips[0]?.id ?? "";
  const [form, setForm] = useState<PatientBookingForm>({
    ...emptyBookingForm,
    tripId: firstTripId,
  });

  function updateField(field: keyof PatientBookingForm, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <PatientModalShell onClose={onClose} title="Criar agendamento">
      <form onSubmit={(event) => onSubmit(form, event)}>
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            disabled={trips.length === 0}
            label="Viagem"
            onChange={(value) => updateField("tripId", value)}
            options={
              trips.length > 0
                ? trips.map((trip) => ({
                    label: `${trip.name} - ${formatDate(trip.departureDate)}`,
                    value: trip.id,
                  }))
                : [{ label: "Nenhuma viagem ativa", value: "" }]
            }
            value={form.tripId}
          />
          <TextField
            label="Destino final"
            onChange={(value) => updateField("finalDestination", value)}
            required
            value={form.finalDestination}
          />
          <TextField
            label="Data da consulta"
            onChange={(value) => updateField("appointmentDate", value)}
            required
            type="date"
            value={form.appointmentDate}
          />
          <CheckboxField
            checked={form.hasCompanion}
            label="Possui acompanhante"
            onChange={(value) => updateField("hasCompanion", value)}
          />
          <TextField
            label="Nome acompanhante"
            onChange={(value) => updateField("companionName", value)}
            value={form.companionName}
          />
          <TextField
            label="SUS acompanhante"
            onChange={(value) => updateField("companionSus", value)}
            value={form.companionSus}
          />
          <TextField
            label="CPF acompanhante"
            onChange={(value) => updateField("companionCpf", value)}
            value={form.companionCpf}
          />
        </div>
        <PatientFormFooter
          error={error}
          isSaving={isSaving || trips.length === 0}
          onClose={onClose}
          savingLabel="Criando..."
          submitLabel="Criar agendamento"
        />
      </form>
    </PatientModalShell>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(value),
  );
}
