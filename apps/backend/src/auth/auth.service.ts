import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { JwtSignOptions } from "@nestjs/jwt";
import { JwtService } from "@nestjs/jwt";
import { verifyPassword } from "./auth.util";
import type { AuthenticatedUser, JwtPayload } from "./auth.type";
import type { CreateUserDto } from "../modules/users/dto/create-user.dto";
import { UsersService } from "../modules/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(ConfigService)
    private readonly config: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (
      !user ||
      !user.isActive ||
      !(await verifyPassword(password, user.passwordHash))
    ) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      accessToken: await this.signToken(authenticatedUser),
      user: this.usersService.toPublicUser(user),
    };
  }

  async bootstrapCoordinator(dto: CreateUserDto) {
    return this.usersService.bootstrapCoordinator(dto);
  }

  private signToken(user: AuthenticatedUser): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.config.getOrThrow<string>("JWT_SECRET"),
      expiresIn: (this.config.get<string>("JWT_EXPIRES_IN") ??
        "8h") as JwtSignOptions["expiresIn"],
    });
  }
}
