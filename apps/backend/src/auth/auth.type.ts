import type { users } from "../db/schema";

export type UserRole = (typeof users.$inferSelect)["role"];

export type AuthenticatedUser = {
  id: string;
  name: string;
  role: UserRole;
  username: string;
};

export type JwtPayload = {
  sub: string;
  name: string;
  role: UserRole;
  username: string;
};
