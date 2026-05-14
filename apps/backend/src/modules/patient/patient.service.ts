import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { CreatePatientDto } from "./dto/create-patient.dto";
import type { UpdatePatientDto } from "./dto/update-patient.dto";
import { PatientsRepository } from "./patient.repository";
import type { Patient, PatientID } from "./patient.type";

@Injectable()
export class PatientService {
  constructor(private readonly patientsRepository: PatientsRepository) {}

  async create(data: CreatePatientDto): Promise<Patient> {
    const patientWithCpf = await this.patientsRepository.findByCpf(data.cpf);

    if (patientWithCpf) {
      throw new ConflictException("CPF already registered");
    }

    const patientWithSusCard = await this.patientsRepository.findBySusCard(
      data.susCard,
    );

    if (patientWithSusCard) {
      throw new ConflictException("SUS card already registered");
    }

    const patient = await this.patientsRepository.create(data);

    if (!patient) {
      throw new Error("Patient could not be created");
    }

    return patient;
  }

  findByCpf(cpf: string): Promise<Patient | undefined> {
    return this.patientsRepository.findByCpf(cpf);
  }

  findByName(name: string): Promise<Patient[] | undefined> {
    return this.patientsRepository.findByName(name);
  }

  async update(id: PatientID, data: UpdatePatientDto): Promise<Patient> {
    const patient = await this.patientsRepository.update(id, data);

    if (!patient) {
      throw new NotFoundException("Patient not found");
    }

    return patient;
  }
}
