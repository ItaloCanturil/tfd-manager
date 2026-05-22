import type { RouteID, RouteScheduleID, TripStatus } from "../trip.type";

export type ListTripsDto = {
  date?: string;
  routeId?: RouteID;
  routeScheduleId?: RouteScheduleID;
  status?: TripStatus;
};

