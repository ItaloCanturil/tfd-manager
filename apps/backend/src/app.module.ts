import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { DbModule } from "./db/db.module";
import { BookingsModule } from "./modules/bookings/bookings.module";
import { PatientModule } from "./modules/patient/patient.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { RouteSchedulesModule } from "./modules/route-schedules/route-schedules.module";
import { RoutesModule } from "./modules/routes/routes.module";
import { TripsModule } from "./modules/trips/trips.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? [`.env.${process.env.NODE_ENV}`, ".env"]
        : [".env"],
      isGlobal: true,
    }),
    DbModule,
    AuthModule,
    PatientModule,
    RoutesModule,
    RouteSchedulesModule,
    TripsModule,
    BookingsModule,
    ReportsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
