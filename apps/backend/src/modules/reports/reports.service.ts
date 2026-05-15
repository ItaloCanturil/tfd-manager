import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type {
  ListPatientsByDestinationReportDto,
  PatientsByDestinationReportFilter,
} from "./dto/list-patients-by-destination-report.dto";
import { ReportsRepository } from "./reports.repository";
import type {
  PatientByDestinationReportItem,
  PatientsByDestinationReport,
  PatientsByDestinationReportDestination,
  ReportBookingRow,
} from "./reports.type";

const SALVADOR_WEEKDAYS = [0, 2, 4];

@Injectable()
export class ReportsService {
  constructor(
    @Inject(ReportsRepository)
    private readonly reportsRepository: ReportsRepository,
  ) {}

  async listPatientsByDestinationReport(
    filters: ListPatientsByDestinationReportDto,
  ): Promise<PatientsByDestinationReport> {
    const filter = parseFilter(filters.filter);
    const { startDate, endDate } = parseDateRange(filters);

    const rows = await this.reportsRepository.listPatientsByDestinationReport({
      startDate,
      endDate,
      destination: filter === "salvador" ? "salvador" : undefined,
      weekdays: filter === "salvador" ? SALVADOR_WEEKDAYS : undefined,
    });

    return {
      filter,
      startDate,
      endDate,
      destinations: groupPatientsByDestination(rows),
    };
  }
}

function groupPatientsByDestination(
  rows: ReportBookingRow[],
): PatientsByDestinationReportDestination[] {
  const destinations = new Map<
    string,
    PatientsByDestinationReportDestination
  >();

  for (const row of rows) {
    const destination =
      destinations.get(row.finalDestination) ??
      createDestinationGroup(row.finalDestination);

    destination.patients.push(toPatientByDestinationReportItem(row));
    destination.totalPatients += 1;

    if (row.hasCompanion) {
      destination.totalCompanions += 1;
    }

    destination.totalSeats += row.hasCompanion ? 2 : 1;
    destinations.set(row.finalDestination, destination);
  }

  return [...destinations.values()];
}

function parseFilter(
  filter: PatientsByDestinationReportFilter | undefined,
): PatientsByDestinationReportFilter {
  if (!filter) {
    return "weekly";
  }

  if (filter !== "weekly" && filter !== "salvador") {
    throw new BadRequestException("Report filter must be weekly or salvador");
  }

  return filter;
}

function parseDateRange(filters: ListPatientsByDestinationReportDto): {
  startDate: string;
  endDate: string;
} {
  if (!filters.startDate || !filters.endDate) {
    throw new BadRequestException("Report startDate and endDate are required");
  }

  const startDate = parseDate(filters.startDate);
  const endDate = parseDate(filters.endDate);

  if (startDate > endDate) {
    throw new BadRequestException(
      "Report startDate must be before or equal to endDate",
    );
  }

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

function createDestinationGroup(
  destination: string,
): PatientsByDestinationReportDestination {
  return {
    destination,
    totalPatients: 0,
    totalCompanions: 0,
    totalSeats: 0,
    patients: [],
  };
}

function toPatientByDestinationReportItem(
  row: ReportBookingRow,
): PatientByDestinationReportItem {
  return {
    bookingId: row.bookingId,
    appointmentDate: row.appointmentDate,
    hasCompanion: row.hasCompanion,
    companionName: row.companionName,
    companionSus: row.companionSus,
    companionCpf: row.companionCpf,
    patientId: row.patientId,
    patientName: row.patientName,
    patientCpf: row.patientCpf,
    patientSusCard: row.patientSusCard,
    patientPhone: row.patientPhone,
    tripId: row.tripId,
    tripName: row.tripName,
    departureDate: row.departureDate,
    routeDestination: row.routeDestination,
  };
}

function parseDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new BadRequestException("Report date must use YYYY-MM-DD format");
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (formatDate(date) !== value) {
    throw new BadRequestException("Report date must be a valid date");
  }

  return date;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
