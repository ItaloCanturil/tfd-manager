import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { CreateRouteScheduleDto } from "./dto/create-route-schedule.dto";
import type { ListRouteSchedulesDto } from "./dto/list-route-schedules.dto";
import type { UpdateRouteScheduleDto } from "./dto/update-route-schedule.dto";
import { RouteScheduleEntity } from "./domain/route-schedule.entity";
import type {
  RouteSchedule,
  RouteScheduleID,
} from "./route-schedules.type";
import { RouteSchedulesRepository } from "./route-schedules.repository";

@Injectable()
export class RouteSchedulesService {
  constructor(
    @Inject(RouteSchedulesRepository)
    private readonly routeSchedulesRepository: RouteSchedulesRepository,
  ) {}

  async create(data: CreateRouteScheduleDto): Promise<RouteSchedule> {
    assertUuid(data.routeId, "Route schedule routeId");

    const route = await this.routeSchedulesRepository.findRouteById(
      data.routeId,
    );

    if (!route) {
      throw new NotFoundException("Route not found");
    }

    const scheduleEntity = RouteScheduleEntity.create(data);
    const schedule = await this.routeSchedulesRepository.create(
      scheduleEntity.toObject(),
    );

    if (!schedule) {
      throw new Error("Route schedule could not be created");
    }

    return schedule;
  }

  list(filters: ListRouteSchedulesDto): Promise<RouteSchedule[]> {
    if (filters.routeId) {
      assertUuid(filters.routeId, "Route schedule routeId");
    }

    return this.routeSchedulesRepository.list(filters);
  }

  async findById(id: RouteScheduleID): Promise<RouteSchedule> {
    assertUuid(id, "Route schedule id");

    const schedule = await this.routeSchedulesRepository.findById(id);

    if (!schedule) {
      throw new NotFoundException("Route schedule not found");
    }

    return schedule;
  }

  async update(
    id: RouteScheduleID,
    data: UpdateRouteScheduleDto,
  ): Promise<RouteSchedule> {
    assertUuid(id, "Route schedule id");

    const schedule = await this.routeSchedulesRepository.update(id, data);

    if (!schedule) {
      throw new NotFoundException("Route schedule not found");
    }

    return schedule;
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
