export type ReportBookingRow = {
  bookingId: string;
  bookingStatus: "CONFIRMED" | "ABSENT" | "CANCELED";
  appointmentDate: string;
  finalDestination: string;
  hasCompanion: boolean;
  companionName: string | null;
  companionSus: string | null;
  companionCpf: string | null;
  patientId: string;
  patientName: string;
  patientCpf: string;
  patientSusCard: string;
  patientPhone: string;
  tripId: string;
  tripName: string;
  departureDate: string;
  routeId: string;
  routeDestination: string;
};

export type PatientByDestinationReportItem = {
  bookingId: string;
  appointmentDate: string;
  hasCompanion: boolean;
  companionName: string | null;
  companionSus: string | null;
  companionCpf: string | null;
  patientId: string;
  patientName: string;
  patientCpf: string;
  patientSusCard: string;
  patientPhone: string;
  tripId: string;
  tripName: string;
  departureDate: string;
  routeDestination: string;
};

export type PatientsByDestinationReportDestination = {
  destination: string;
  totalPatients: number;
  totalCompanions: number;
  totalSeats: number;
  patients: PatientByDestinationReportItem[];
};

export type PatientsByDestinationReport = {
  filter: "weekly" | "salvador";
  startDate: string;
  endDate: string;
  destinations: PatientsByDestinationReportDestination[];
};
