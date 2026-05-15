import { Body, Controller, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { Roles } from "../../auth/auth.decorators";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
@Roles("COORDINATOR")
export class UsersController {
  constructor(@Inject(UsersService) private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get()
  list() {
    return this.usersService.list();
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }
}
