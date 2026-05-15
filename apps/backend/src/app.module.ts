import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { DbModule } from "./db/db.module";
import { BookingsModule } from "./modules/bookings/bookings.module";
import { PatientModule } from "./modules/patient/patient.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { RoutesModule } from "./modules/routes/routes.module";
import { TripsModule } from "./modules/trips/trips.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    DbModule,
    AuthModule,
    PatientModule,
    RoutesModule,
    TripsModule,
    BookingsModule,
    ReportsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
