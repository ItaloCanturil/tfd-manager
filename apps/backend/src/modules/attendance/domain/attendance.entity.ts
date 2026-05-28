export type TicketProps = {
  id?: string;
  code: string;
  serviceId: string;
  roomId: string;
  status?: "WAITING" | "CALLED" | "IN_SERVICE" | "DONE";
};

export type ticketCallProps = {
  id?: string;
  ticketId: string;
  callNumber: number;
  roomId: string;
  calledByUserId: string;
};

export type ticketDailyCounts = {
  id: string;
  serviceId: string;
  counterDate: string;
  lastNumber: number;
};

export class AttendanceEntity {
  private constructor() {}
}
