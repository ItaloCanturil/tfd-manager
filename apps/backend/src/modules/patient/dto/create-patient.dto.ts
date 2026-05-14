import type { NewPatient } from "../patient.type";

export type CreatePatientDto = Pick<
  NewPatient,
  "name" | "cpf" | "susCard" | "birthDate" | "rg" | "phone"
>;
