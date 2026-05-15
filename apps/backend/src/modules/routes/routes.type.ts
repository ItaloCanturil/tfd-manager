import type { routes } from "../../db/schema";

export type Route = typeof routes.$inferSelect;

export type NewRoute = typeof routes.$inferInsert;

export type RouteID = Route["id"];

export type UpdateRoute = Partial<
  Omit<NewRoute, "id" | "createdAt" | "updatedAt">
>;
