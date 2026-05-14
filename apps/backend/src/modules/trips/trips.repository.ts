import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { DATABASE } from "../../db/db.constants";
import type { Database } from "../../db/db.type";
import { routes, trips } from "../../db/schema";
import type { ListTripsDto } from "./dto/list-trips.dto";
import type { NewTrip, Route, RouteID, Trip, TripID, UpdateTrip } from "./trip.type";

@Injectable()
export class TripsRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findRouteById(id: RouteID): Promise<Route | undefined> {
    return this.db.query.routes.findFirst({
      where: eq(routes.id, id),
    });
  }

  async findById(id: TripID): Promise<Trip | undefined> {
    return this.db.query.trips.findFirst({
      where: eq(trips.id, id),
    });
  }

  async list(filters: ListTripsDto): Promise<Trip[]> {
    const conditions = [
      filters.date ? eq(trips.departureDate, filters.date) : undefined,
      filters.routeId ? eq(trips.routeId, filters.routeId) : undefined,
      filters.status ? eq(trips.status, filters.status) : undefined,
    ].filter((condition) => condition !== undefined);

    return this.db
      .select()
      .from(trips)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
  }

  async create(trip: NewTrip): Promise<Trip | undefined> {
    const [createdTrip] = await this.db.insert(trips).values(trip).returning();

    return createdTrip;
  }

  async update(id: TripID, data: UpdateTrip): Promise<Trip | undefined> {
    const [trip] = await this.db
      .update(trips)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(trips.id, id))
      .returning();

    return trip;
  }
}

