import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { CreateRouteDto } from "./dto/create-route.dto";
import type { ListRoutesDto } from "./dto/list-routes.dto";
import type { UpdateRouteDto } from "./dto/update-route.dto";
import { RouteEntity } from "./domain/routes.entity";
import { RoutesRepository } from "./routes.repository";
import type { Route, RouteID } from "./routes.type";

@Injectable()
export class RoutesService {
  constructor(
    @Inject(RoutesRepository)
    private readonly routesRepository: RoutesRepository,
  ) {}

  async create(data: CreateRouteDto): Promise<Route> {
    const routeEntity = RouteEntity.create(data);
    const route = await this.routesRepository.create(routeEntity.toObject());

    if (!route) {
      throw new Error("Route could not be created");
    }

    return route;
  }

  list(filters: ListRoutesDto): Promise<Route[]> {
    return this.routesRepository.list(filters);
  }

  async findById(id: RouteID): Promise<Route> {
    const route = await this.routesRepository.findById(id);

    if (!route) {
      throw new NotFoundException("Route not found");
    }

    return route;
  }

  async update(id: RouteID, data: UpdateRouteDto): Promise<Route> {
    const route = await this.routesRepository.update(id, data);

    if (!route) {
      throw new NotFoundException("Route not found");
    }

    return route;
  }

  async delete(id: RouteID): Promise<Route> {
    const route = await this.routesRepository.delete(id);

    if (!route) {
      throw new NotFoundException("Route not found");
    }

    return route;
  }
}
