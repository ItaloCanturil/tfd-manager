import type { UserRole } from "../../../auth/auth.type";

export type CreateUserDto = {
  name: string;
  password: string;
  role: UserRole;
  username: string;
};
