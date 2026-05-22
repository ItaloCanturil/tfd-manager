import type { NewTrip } from "../trip.type";

export type CreateTripDto = Pick<
  NewTrip,
  "routeScheduleId" | "departureDate" | "notes"
> &
  Partial<Pick<NewTrip, "name" | "capacity">>;

