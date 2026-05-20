import { Module } from "@nestjs/common";
import { RouteSchedulesController } from "./route-schedules.controller";
import { RouteSchedulesRepository } from "./route-schedules.repository";
import { RouteSchedulesService } from "./route-schedules.service";

@Module({
  controllers: [RouteSchedulesController],
  providers: [RouteSchedulesRepository, RouteSchedulesService],
})
export class RouteSchedulesModule {}
