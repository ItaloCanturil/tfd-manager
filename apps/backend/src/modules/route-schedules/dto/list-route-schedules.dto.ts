import type { RouteID, RouteSchedule } from "../route-schedules.type";

export type ListRouteSchedulesDto = {
  isActive?: RouteSchedule["isActive"];
  routeId?: RouteID;
};
