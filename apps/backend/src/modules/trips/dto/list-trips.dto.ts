import type { RouteID, TripStatus } from "../trip.type";

export type ListTripsDto = {
  date?: string;
  routeId?: RouteID;
  status?: TripStatus;
};

