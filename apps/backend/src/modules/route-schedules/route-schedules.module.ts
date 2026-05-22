import { Module } from "@nestjs/common";
import { TripsModule } from "../trips/trips.module";
import { RouteSchedulesController } from "./route-schedules.controller";
import { RouteSchedulesRepository } from "./route-schedules.repository";
import { RouteSchedulesService } from "./route-schedules.service";

@Module({
  imports: [TripsModule],
  controllers: [RouteSchedulesController],
  providers: [RouteSchedulesRepository, RouteSchedulesService],
})
export class RouteSchedulesModule {}
