import type { UserRole } from "../../../auth/auth.type";

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};
