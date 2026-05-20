import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { CreateTripDto } from "./dto/create-trip.dto";
import type { ListTripsDto } from "./dto/list-trips.dto";
import { TripEntity } from "./domain/trip.entity";
import type { Trip, TripID, UpdateTrip } from "./trip.type";
import { TripsRepository } from "./trips.repository";

@Injectable()
export class TripsService {
  constructor(
    @Inject(TripsRepository)
    private readonly tripsRepository: TripsRepository,
  ) {}

  async create(data: CreateTripDto): Promise<Trip> {
    assertUuid(data.routeScheduleId, "Trip routeScheduleId");

    const schedule = await this.tripsRepository.findRouteScheduleById(
      data.routeScheduleId,
    );

    if (!schedule) {
      throw new NotFoundException("Route schedule not found");
    }

    const tripEntity = TripEntity.create({
      ...data,
      routeId: schedule.routeId,
      capacity: data.capacity ?? schedule.defaultCapacity,
    });

    const trip = await this.tripsRepository.create(tripEntity.toObject());

    if (!trip) {
      throw new Error("Trip could not be created");
    }

    return trip;
  }

  list(filters: ListTripsDto): Promise<Trip[]> {
    if (filters.routeId) {
      assertUuid(filters.routeId, "Trip routeId");
    }

    if (filters.routeScheduleId) {
      assertUuid(filters.routeScheduleId, "Trip routeScheduleId");
    }

    return this.tripsRepository.list(filters);
  }

  async findById(id: TripID): Promise<Trip> {
    assertUuid(id, "Trip id");

    const trip = await this.tripsRepository.findById(id);

    if (!trip) {
      throw new NotFoundException("Trip not found");
    }

    return trip;
  }

  async update(id: TripID, data: UpdateTrip): Promise<Trip> {
    assertUuid(id, "Trip id");

    const trip = await this.tripsRepository.update(id, data);

    if (!trip) {
      throw new NotFoundException("Trip not found");
    }

    return trip;
  }

  cancel(id: TripID): Promise<Trip> {
    return this.update(id, { status: "CANCELED" });
  }
}

function assertUuid(value: string, fieldName: string): void {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  ) {
    throw new BadRequestException(`${fieldName} must be a valid UUID`);
  }
}
