import {
  ConflictException,
  Injectable,
  NotFoundException,
  Inject,
} from "@nestjs/common";
import { hashPassword } from "../../auth/auth.util";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateUserDto } from "./dto/update-user.dto";
import { UsersRepository } from "./users.repository";
import type { PublicUser, User, UserID } from "./users.type";

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<PublicUser> {
    const existingUser = await this.usersRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException("User email already exists");
    }

    const user = await this.usersRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      passwordHash: await hashPassword(dto.password),
      role: dto.role,
    });

    if (!user) {
      throw new ConflictException("Could not create user");
    }

    return this.toPublicUser(user);
  }

  async bootstrapCoordinator(dto: CreateUserDto): Promise<PublicUser> {
    const usersCount = await this.usersRepository.count();

    if (usersCount > 0) {
      throw new ConflictException(
        "Bootstrap is only available before users exist",
      );
    }

    return this.create({ ...dto, role: "COORDINATOR" });
  }

  async list(): Promise<PublicUser[]> {
    const users = await this.usersRepository.list();

    return users.map((user) => this.toPublicUser(user));
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findByEmail(email);
  }

  async update(id: UserID, dto: UpdateUserDto): Promise<PublicUser> {
    const user = await this.usersRepository.update(id, {
      name: dto.name,
      email: dto.email?.toLowerCase(),
      passwordHash: dto.password ? await hashPassword(dto.password) : undefined,
      role: dto.role,
      isActive: dto.isActive,
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.toPublicUser(user);
  }

  toPublicUser(user: User): PublicUser {
    const { passwordHash: _passwordHash, ...publicUser } = user;

    return publicUser;
  }
}
