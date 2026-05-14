import { Injectable, NotFoundException } from "@nestjs/common";
import type { CreateTripDto } from "./dto/create-trip.dto";
import type { ListTripsDto } from "./dto/list-trips.dto";
import { TripEntity } from "./domain/trip.entity";
import type { Trip, TripID, UpdateTrip } from "./trip.type";
import { TripsRepository } from "./trips.repository";

@Injectable()
export class TripsService {
  constructor(private readonly tripsRepository: TripsRepository) {}

  async create(data: CreateTripDto): Promise<Trip> {
    const route = await this.tripsRepository.findRouteById(data.routeId);

    if (!route) {
      throw new NotFoundException("Route not found");
    }

    const tripEntity = TripEntity.create({
      ...data,
      capacity: data.capacity ?? route.defaultCapacity,
    });

    const trip = await this.tripsRepository.create(tripEntity.toObject());

    if (!trip) {
      throw new Error("Trip could not be created");
    }

    return trip;
  }

  list(filters: ListTripsDto): Promise<Trip[]> {
    return this.tripsRepository.list(filters);
  }

  async findById(id: TripID): Promise<Trip> {
    const trip = await this.tripsRepository.findById(id);

    if (!trip) {
      throw new NotFoundException("Trip not found");
    }

    return trip;
  }

  async update(id: TripID, data: UpdateTrip): Promise<Trip> {
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

