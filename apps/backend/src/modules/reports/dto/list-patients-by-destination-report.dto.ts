export type PatientsByDestinationReportFilter = "weekly" | "salvador";

export type ListPatientsByDestinationReportDto = {
  filter?: PatientsByDestinationReportFilter;
  startDate?: string;
  endDate?: string;
};
