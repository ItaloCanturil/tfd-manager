import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { DbModule } from "./db/db.module";
import { PatientModule } from "./modules/patient/patient.module";
import { TripsModule } from "./modules/trips/trips.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    DbModule,
    PatientModule,
    TripsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
