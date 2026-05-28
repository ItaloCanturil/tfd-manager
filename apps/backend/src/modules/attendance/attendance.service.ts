import { Inject, Injectable } from "@nestjs/common";
import { DATABASE } from "../../db/db.constants";
import type { Database } from "../../db/db.type";

@Injectable()
export class AttendanceRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  create(idRoom) {}
}
