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
import type { CreateTripDto } from "./dto/create-trip.dto";
import type { ListTripsDto } from "./dto/list-trips.dto";
import type { UpdateTripDto } from "./dto/update-trip.dto";
import { TripsService } from "./trips.service";

@Controller("trips")
export class TripsController {
  constructor(
    @Inject(TripsService) private readonly tripsService: TripsService,
  ) {}

  @Post()
  @Roles("COORDINATOR")
  create(@Body() body: CreateTripDto) {
    return this.tripsService.create(body);
  }

  @Get()
  @Roles("COORDINATOR", "RECEPTIONIST", "TRANSPORT")
  list(@Query() query: ListTripsDto) {
    return this.tripsService.list(query);
  }

  @Get(":id")
  @Roles("COORDINATOR", "RECEPTIONIST", "TRANSPORT")
  findById(@Param("id") id: string) {
    return this.tripsService.findById(id);
  }

  @Patch(":id")
  @Roles("COORDINATOR")
  update(@Param("id") id: string, @Body() body: UpdateTripDto) {
    return this.tripsService.update(id, body);
  }

  @Patch(":id/cancel")
  @Roles("COORDINATOR")
  cancel(@Param("id") id: string) {
    return this.tripsService.cancel(id);
  }
}
