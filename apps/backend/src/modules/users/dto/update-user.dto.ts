import type { UserRole } from "../../../auth/auth.type";

export type UpdateUserDto = {
  name?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
  username?: string;
};
