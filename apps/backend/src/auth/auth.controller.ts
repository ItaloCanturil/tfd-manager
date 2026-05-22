import { Body, Controller, Get, Inject, Post, Req } from "@nestjs/common";
import { Public } from "./auth.decorators";
import { AuthService } from "./auth.service";
import type { AuthenticatedUser } from "./auth.type";
import type { LoginDto } from "./dto/login.dto";
import type { CreateUserDto } from "../modules/users/dto/create-user.dto";

type AuthenticatedRequest = {
  user: AuthenticatedUser;
};

@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body.username, body.password);
  }

  @Public()
  @Post("bootstrap")
  bootstrapCoordinator(@Body() body: CreateUserDto) {
    return this.authService.bootstrapCoordinator(body);
  }

  @Get("me")
  me(@Req() request: AuthenticatedRequest) {
    return request.user;
  }
}
