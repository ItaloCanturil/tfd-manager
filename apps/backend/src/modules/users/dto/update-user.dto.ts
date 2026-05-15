import type { UserRole } from "../../../auth/auth.type";

export type UpdateUserDto = {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
};
