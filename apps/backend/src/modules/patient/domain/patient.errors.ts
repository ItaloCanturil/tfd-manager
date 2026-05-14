export class InvalidPatientNameError extends Error {
  constructor() {
    super("Patient name is required");
    this.name = "InvalidPatientNameError";
  }
}

export class InvalidSusCardNumber extends Error {
  constructor() {
    super("Sus card is invalid");
    this.name = "InvalidSusCardNumber";
  }
}
