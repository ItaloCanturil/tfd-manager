import { Controller, Get, Inject, Query } from "@nestjs/common";
import { Roles } from "../../auth/auth.decorators";
import type { ListPatientsByDestinationReportDto } from "./dto/list-patients-by-destination-report.dto";
import { ReportsService } from "./reports.service";

@Controller("reports")
export class ReportsController {
  constructor(
    @Inject(ReportsService)
    private readonly reportsService: ReportsService,
  ) {}

  @Get("patients-by-destination")
  @Roles("COORDINATOR", "RECEPTIONIST", "TRANSPORT")
  listPatientsByDestinationReport(
    @Query() query: ListPatientsByDestinationReportDto,
  ) {
    return this.reportsService.listPatientsByDestinationReport(query);
  }
}
