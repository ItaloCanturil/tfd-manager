import type { NewRouteSchedule } from "../route-schedules.type";

export type CreateRouteScheduleDto = Pick<
  NewRouteSchedule,
  "routeId" | "label" | "departureTime" | "weekdays" | "defaultCapacity"
> &
  Partial<Pick<NewRouteSchedule, "isActive">>;
