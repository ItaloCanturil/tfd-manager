import { Inject, Injectable } from "@nestjs/common";
import { asc, eq } from "drizzle-orm";
import { DATABASE } from "../../db/db.constants";
import type { Database } from "../../db/db.type";
import { patients } from "../../db/schema";
import type {
  NewPatient,
  Patient,
  PatientID,
  UpdatePatient,
} from "./patient.type";

@Injectable()
export class PatientsRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findByCpf(cpf: string): Promise<Patient | undefined> {
    return this.db.query.patients.findFirst({
      where: eq(patients.cpf, cpf),
    });
  }

  async findById(id: PatientID): Promise<Patient | undefined> {
    return this.db.query.patients.findFirst({
      where: eq(patients.id, id),
    });
  }

  async findBySusCard(sus: string): Promise<Patient | undefined> {
    return this.db.query.patients.findFirst({
      where: eq(patients.susCard, sus),
    });
  }

  async list(): Promise<Patient[]> {
    return this.db.query.patients.findMany({
      orderBy: asc(patients.name),
    });
  }

  async findByName(name: string): Promise<Patient[] | undefined> {
    return this.db.query.patients.findMany({
      where: eq(patients.name, name),
    });
  }

  async create(patient: NewPatient): Promise<Patient | undefined> {
    const [createdPatient] = await this.db
      .insert(patients)
      .values(patient)
      .returning();

    return createdPatient;
  }

  async update(
    id: PatientID,
    data: UpdatePatient,
  ): Promise<Patient | undefined> {
    const [patient] = await this.db
      .update(patients)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();

    return patient;
  }
}
