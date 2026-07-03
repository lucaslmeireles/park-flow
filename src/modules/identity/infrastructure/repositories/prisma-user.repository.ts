import { PrismaService } from 'src/config/database/prisma.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    const props = user.getProps();
    await this.prisma.user.upsert({
      where: { id: user.getId() },
      update: {
        name: props.name,
        email: props.email,
        password: props.password,
      },
      create: {
        id: user.getId(),
        name: props.name,
        email: props.email,
        password: props.password,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!data || data.deletedAt) {
      return null;
    }

    return this.toDomain(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!data || data.deletedAt) {
      return null;
    }

    return this.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private toDomain(data: any): User {
    return User.reconstruct(data.id, {
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }
}
