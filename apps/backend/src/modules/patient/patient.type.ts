import type { patients } from "../../db/schema";

export type Patient = typeof patients.$inferSelect;

export type NewPatient = typeof patients.$inferInsert;

export type PatientID = Patient["id"];

export type UpdatePatient = Partial<
  Omit<NewPatient, "id" | "createdAt" | "updatedAt">
>;
