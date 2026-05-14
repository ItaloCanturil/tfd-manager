import type { NewTrip } from "../trip.type";

export type CreateTripDto = Pick<
  NewTrip,
  "routeId" | "departureDate" | "notes"
> &
  Partial<Pick<NewTrip, "name" | "capacity">>;

