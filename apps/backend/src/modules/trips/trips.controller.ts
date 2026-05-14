import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import type { CreateTripDto } from "./dto/create-trip.dto";
import type { ListTripsDto } from "./dto/list-trips.dto";
import type { UpdateTripDto } from "./dto/update-trip.dto";
import { TripsService } from "./trips.service";

@Controller("trips")
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Body() body: CreateTripDto) {
    return this.tripsService.create(body);
  }

  @Get()
  list(@Query() query: ListTripsDto) {
    return this.tripsService.list(query);
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.tripsService.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateTripDto) {
    return this.tripsService.update(id, body);
  }

  @Patch(":id/cancel")
  cancel(@Param("id") id: string) {
    return this.tripsService.cancel(id);
  }
}

