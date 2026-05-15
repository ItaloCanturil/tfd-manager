import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { DATABASE } from "../../db/db.constants";
import type { Database } from "../../db/db.type";
import { routes } from "../../db/schema";
import type { ListRoutesDto } from "./dto/list-routes.dto";
import type { NewRoute, Route, RouteID, UpdateRoute } from "./routes.type";

@Injectable()
export class RoutesRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findById(id: RouteID): Promise<Route | undefined> {
    return this.db.query.routes.findFirst({
      where: eq(routes.id, id),
    });
  }

  async list(filters: ListRoutesDto): Promise<Route[]> {
    const conditions = [
      filters.destination
        ? eq(routes.destination, filters.destination)
        : undefined,
    ].filter((condition) => condition !== undefined);

    return this.db
      .select()
      .from(routes)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
  }

  async create(route: NewRoute): Promise<Route | undefined> {
    const [createdRoute] = await this.db
      .insert(routes)
      .values(route)
      .returning();

    return createdRoute;
  }

  async update(id: RouteID, data: UpdateRoute): Promise<Route | undefined> {
    const [route] = await this.db
      .update(routes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(routes.id, id))
      .returning();

    return route;
  }
}
