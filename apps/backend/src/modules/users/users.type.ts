import type { users } from "../../db/schema";

export type User = typeof users.$inferSelect;

export type NewUser = typeof users.$inferInsert;

export type UserID = User["id"];

export type PublicUser = Omit<User, "passwordHash">;

export type UpdateUser = Partial<
  Omit<NewUser, "id" | "createdAt" | "updatedAt">
>;
