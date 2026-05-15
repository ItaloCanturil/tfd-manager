import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { Roles } from "../../auth/auth.decorators";
import type { CreatePatientDto } from "./dto/create-patient.dto";
import type { UpdatePatientDto } from "./dto/update-patient.dto";
import { PatientService } from "./patient.service";

@Controller("patients")
export class PatientController {
  constructor(
    @Inject(PatientService)
    private readonly patientService: PatientService,
  ) {}

  @Post()
  @Roles("COORDINATOR", "RECEPTIONIST")
  create(@Body() body: CreatePatientDto) {
    return this.patientService.create(body);
  }

  @Get("cpf/:cpf")
  @Roles("COORDINATOR", "RECEPTIONIST", "TRANSPORT")
  async findByCpf(@Param("cpf") cpf: string) {
    const patient = await this.patientService.findByCpf(cpf);

    if (!patient) {
      throw new NotFoundException("Patient not found");
    }

    return patient;
  }

  @Patch(":id")
  @Roles("COORDINATOR", "RECEPTIONIST")
  update(@Param("id") id: string, @Body() body: UpdatePatientDto) {
    return this.patientService.update(id, body);
  }
}
