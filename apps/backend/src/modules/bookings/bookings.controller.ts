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
import { BookingsService } from "./bookings.service";
import type { CreateBookingDto } from "./dto/create-booking.dto";
import type { ListBookingsDto } from "./dto/list-bookings.dto";
import type { UpdateBookingDto } from "./dto/update-booking.dto";

@Controller("bookings")
export class BookingsController {
  constructor(
    @Inject(BookingsService)
    private readonly bookingsService: BookingsService,
  ) {}

  @Post()
  @Roles("COORDINATOR", "RECEPTIONIST")
  create(@Body() body: CreateBookingDto) {
    return this.bookingsService.create(body);
  }

  @Get()
  @Roles("COORDINATOR", "RECEPTIONIST", "TRANSPORT")
  list(@Query() query: ListBookingsDto) {
    return this.bookingsService.list(query);
  }

  @Get(":id")
  @Roles("COORDINATOR", "RECEPTIONIST", "TRANSPORT")
  findById(@Param("id") id: string) {
    return this.bookingsService.findById(id);
  }

  @Patch(":id")
  @Roles("COORDINATOR", "RECEPTIONIST")
  update(@Param("id") id: string, @Body() body: UpdateBookingDto) {
    return this.bookingsService.update(id, body);
  }

  @Patch(":id/cancel")
  @Roles("COORDINATOR", "RECEPTIONIST")
  cancel(@Param("id") id: string) {
    return this.bookingsService.cancel(id);
  }

  @Patch(":id/absent")
  @Roles("COORDINATOR", "RECEPTIONIST")
  markAbsent(@Param("id") id: string) {
    return this.bookingsService.markAbsent(id);
  }
}
