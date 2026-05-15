export class InvalidBookingAppointmentDateError extends Error {
  constructor() {
    super("Booking appointment date is required");
    this.name = "InvalidBookingAppointmentDateError";
  }
}

export class InvalidBookingFinalDestinationError extends Error {
  constructor() {
    super("Booking final destination is required");
    this.name = "InvalidBookingFinalDestinationError";
  }
}
