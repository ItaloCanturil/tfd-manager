import type { routes, trips } from "../../db/schema";

export type Trip = typeof trips.$inferSelect;

export type NewTrip = typeof trips.$inferInsert;

export type TripID = Trip["id"];

export type TripStatus = Trip["status"];

export type UpdateTrip = Partial<
  Omit<NewTrip, "id" | "routeId" | "createdAt" | "updatedAt">
>;

export type Route = typeof routes.$inferSelect;

export type RouteID = Route["id"];
