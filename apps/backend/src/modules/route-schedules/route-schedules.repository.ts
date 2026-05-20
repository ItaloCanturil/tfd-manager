import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { DATABASE } from "../../db/db.constants";
import type { Database } from "../../db/db.type";
import { routeSchedules, routes } from "../../db/schema";
import type { ListRouteSchedulesDto } from "./dto/list-route-schedules.dto";
import type {
  NewRouteSchedule,
  Route,
  RouteID,
  RouteSchedule,
  RouteScheduleID,
  UpdateRouteSchedule,
} from "./route-schedules.type";

@Injectable()
export class RouteSchedulesRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findRouteById(id: RouteID): Promise<Route | undefined> {
    return this.db.query.routes.findFirst({
      where: eq(routes.id, id),
    });
  }

  async findById(id: RouteScheduleID): Promise<RouteSchedule | undefined> {
    return this.db.query.routeSchedules.findFirst({
      where: eq(routeSchedules.id, id),
    });
  }

  async list(filters: ListRouteSchedulesDto): Promise<RouteSchedule[]> {
    const conditions = [
      filters.routeId ? eq(routeSchedules.routeId, filters.routeId) : undefined,
      filters.isActive !== undefined
        ? eq(routeSchedules.isActive, filters.isActive)
        : undefined,
    ].filter((condition) => condition !== undefined);

    return this.db
      .select()
      .from(routeSchedules)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
  }

  async create(
    schedule: NewRouteSchedule,
  ): Promise<RouteSchedule | undefined> {
    const [createdSchedule] = await this.db
      .insert(routeSchedules)
      .values(schedule)
      .returning();

    return createdSchedule;
  }

  async update(
    id: RouteScheduleID,
    data: UpdateRouteSchedule,
  ): Promise<RouteSchedule | undefined> {
    const [schedule] = await this.db
      .update(routeSchedules)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(routeSchedules.id, id))
      .returning();

    return schedule;
  }
}
