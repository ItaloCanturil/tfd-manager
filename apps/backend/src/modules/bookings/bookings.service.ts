import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { Booking, BookingID, UpdateBooking } from "./bookings.type";
import { BookingsRepository } from "./bookings.repository";
import type { CreateBookingDto } from "./dto/create-booking.dto";
import type { ListBookingsDto } from "./dto/list-bookings.dto";
import { BookingEntity } from "./domain/booking.entity";

@Injectable()
export class BookingsService {
  constructor(
    @Inject(BookingsRepository)
    private readonly bookingsRepository: BookingsRepository,
  ) {}

  async create(data: CreateBookingDto): Promise<Booking> {
    const [patient, trip] = await Promise.all([
      this.bookingsRepository.findPatientById(data.patientId),
      this.bookingsRepository.findTripById(data.tripId),
    ]);

    if (!patient) {
      throw new NotFoundException("Patient not found");
    }

    if (!trip) {
      throw new NotFoundException("Trip not found");
    }

    if (trip.status === "CANCELED") {
      throw new ConflictException("Trip is canceled");
    }

    const bookingEntity = BookingEntity.create(data);
    const booking = bookingEntity.toObject();
    const requestedSeats = booking.hasCompanion ? 2 : 1;
    const reservedSeats =
      await this.bookingsRepository.countReservedSeatsByTripId(data.tripId);

    if (reservedSeats + requestedSeats > trip.capacity) {
      throw new ConflictException("Trip capacity exceeded");
    }

    const createdBooking = await this.bookingsRepository.create(booking);

    if (!createdBooking) {
      throw new Error("Booking could not be created");
    }

    return createdBooking;
  }

  list(filters: ListBookingsDto): Promise<Booking[]> {
    return this.bookingsRepository.list(filters);
  }

  async findById(id: BookingID): Promise<Booking> {
    const booking = await this.bookingsRepository.findById(id);

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    return booking;
  }

  async update(id: BookingID, data: UpdateBooking): Promise<Booking> {
    if (data.finalDestination !== undefined && !data.finalDestination.trim()) {
      throw new BadRequestException("Booking final destination is required");
    }

    const booking = await this.bookingsRepository.update(id, data);

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    return booking;
  }

  cancel(id: BookingID): Promise<Booking> {
    return this.update(id, { status: "CANCELED" });
  }

  markAbsent(id: BookingID): Promise<Booking> {
    return this.update(id, { status: "ABSENT" });
  }
}
