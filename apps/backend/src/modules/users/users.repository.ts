import { Inject, Injectable } from "@nestjs/common";
import { count, eq } from "drizzle-orm";
import { DATABASE } from "../../db/db.constants";
import type { Database } from "../../db/db.type";
import { users } from "../../db/schema";
import type { NewUser, UpdateUser, User, UserID } from "./users.type";

@Injectable()
export class UsersRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async count(): Promise<number> {
    const [result] = await this.db.select({ count: count() }).from(users);

    return result?.count ?? 0;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: eq(users.username, username.toLowerCase()),
    });
  }

  async findById(id: UserID): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async list(): Promise<User[]> {
    return this.db.select().from(users);
  }

  async create(user: NewUser): Promise<User | undefined> {
    const [createdUser] = await this.db.insert(users).values(user).returning();

    return createdUser;
  }

  async update(id: UserID, data: UpdateUser): Promise<User | undefined> {
    const [user] = await this.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return user;
  }
}
