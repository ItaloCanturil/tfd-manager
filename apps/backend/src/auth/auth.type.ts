import type { users } from "../db/schema";

export type UserRole = (typeof users.$inferSelect)["role"];

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
};
