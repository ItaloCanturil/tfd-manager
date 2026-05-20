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
import type { CreateRouteScheduleDto } from "./dto/create-route-schedule.dto";
import type { ListRouteSchedulesDto } from "./dto/list-route-schedules.dto";
import type { UpdateRouteScheduleDto } from "./dto/update-route-schedule.dto";
import { RouteSchedulesService } from "./route-schedules.service";

@Controller("route-schedules")
export class RouteSchedulesController {
  constructor(
    @Inject(RouteSchedulesService)
    private readonly routeSchedulesService: RouteSchedulesService,
  ) {}

  @Post()
  @Roles("COORDINATOR")
  create(@Body() body: CreateRouteScheduleDto) {
    return this.routeSchedulesService.create(body);
  }

  @Get()
  @Roles("COORDINATOR", "RECEPTIONIST", "TRANSPORT")
  list(@Query() query: ListRouteSchedulesDto) {
    return this.routeSchedulesService.list(query);
  }

  @Get(":id")
  @Roles("COORDINATOR", "RECEPTIONIST", "TRANSPORT")
  findById(@Param("id") id: string) {
    return this.routeSchedulesService.findById(id);
  }

  @Patch(":id")
  @Roles("COORDINATOR")
  update(@Param("id") id: string, @Body() body: UpdateRouteScheduleDto) {
    return this.routeSchedulesService.update(id, body);
  }
}
