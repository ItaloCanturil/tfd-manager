import { Body, Controller, Get, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import type { CreatePatientDto } from "./dto/create-patient.dto";
import type { UpdatePatientDto } from "./dto/update-patient.dto";
import { PatientService } from "./patient.service";

@Controller("patients")
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  create(@Body() body: CreatePatientDto) {
    return this.patientService.create(body);
  }

  @Get("cpf/:cpf")
  async findByCpf(@Param("cpf") cpf: string) {
    const patient = await this.patientService.findByCpf(cpf);

    if (!patient) {
      throw new NotFoundException("Patient not found");
    }

    return patient;
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdatePatientDto) {
    return this.patientService.update(id, body);
  }
}
