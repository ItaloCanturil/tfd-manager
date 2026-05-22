import type { routeSchedules, routes } from "../../db/schema";

export type RouteSchedule = typeof routeSchedules.$inferSelect;

export type NewRouteSchedule = typeof routeSchedules.$inferInsert;

export type RouteScheduleID = RouteSchedule["id"];

export type UpdateRouteSchedule = Partial<
  Omit<NewRouteSchedule, "id" | "routeId" | "createdAt" | "updatedAt">
>;

export type Route = typeof routes.$inferSelect;

export type RouteID = Route["id"];
