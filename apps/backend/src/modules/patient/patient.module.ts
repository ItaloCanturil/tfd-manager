import { Module } from "@nestjs/common";
import { PatientController } from "./patient.controller";
import { PatientsRepository } from "./patient.repository";
import { PatientService } from "./patient.service";

@Module({
  controllers: [PatientController],
  providers: [PatientService, PatientsRepository],
  exports: [PatientService, PatientsRepository],
})
export class PatientModule {}
