import type {
  AppointmentDate,
  BookingStatus,
  PatientID,
  TripID,
} from "../bookings.type";

export type ListBookingsDto = {
  patientId?: PatientID;
  tripId?: TripID;
  status?: BookingStatus;
  appointmentDate: AppointmentDate;
};
