import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { Roles } from "../../auth/auth.decorators";
import type { CreateRouteDto } from "./dto/create-route.dto";
import type { ListRoutesDto } from "./dto/list-routes.dto";
import type { UpdateRouteDto } from "./dto/update-route.dto";
import { RoutesService } from "./routes.service";

@Controller("routes")
export class RoutesController {
  constructor(
    @Inject(RoutesService) private readonly routesService: RoutesService,
  ) {}

  @Post()
  @Roles("COORDINATOR")
  create(@Body() body: CreateRouteDto) {
    return this.routesService.create(body);
  }

  @Get()
  @Roles("COORDINATOR", "RECEPTIONIST", "TRANSPORT")
  list(@Query() query: ListRoutesDto) {
    return this.routesService.list(query);
  }

  @Get(":id")
  @Roles("COORDINATOR", "RECEPTIONIST", "TRANSPORT")
  findById(@Param("id") id: string) {
    return this.routesService.findById(id);
  }

  @Patch(":id")
  @Roles("COORDINATOR")
  update(@Param("id") id: string, @Body() body: UpdateRouteDto) {
    return this.routesService.update(id, body);
  }
}
