import { Injectable } from '@nestjs/common';
import { VehicleRepository } from '../../domain/repositories/vehicle.repository';
import { Vehicle } from '../../domain/entities/vehicle';
import { LicensePlate } from '../../domain/value-objects/license-plate';
import { PrismaService } from 'src/config/database/prisma.service';

/**
 * PrismaVehicleRepository
 *
 * Infrastructure implementation of VehicleRepository using Prisma
 * This is where database access happens
 * The domain layer doesn't depend on this - only this depends on the domain
 */
@Injectable()
export class PrismaVehicleRepository implements VehicleRepository {
  constructor(private prisma: PrismaService) {}

  async save(vehicle: Vehicle): Promise<void> {
    const props = vehicle.getProps();

    await this.prisma.vehicle.upsert({
      where: { id: vehicle.getId() },
      update: {
        brand: props.brand,
        model: props.model,
        color: props.color,
        nickname: props.nickname,
        ownerId: props.ownerId,
        updatedAt: props.updatedAt,
      },
      create: {
        id: vehicle.getId(),
        plate: props.plate.toString(),
        category: props.category,
        brand: props.brand,
        model: props.model,
        color: props.color,
        nickname: props.nickname,
        ownerId: props.ownerId,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Vehicle | null> {
    const data = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!data || data.deletedAt) {
      return null;
    }

    return this.toDomain(data);
  }

  async findByPlate(plate: string): Promise<Vehicle | null> {
    const data = await this.prisma.vehicle.findUnique({
      where: { plate },
    });

    if (!data || data.deletedAt) {
      return null;
    }

    return this.toDomain(data);
  }

  async findByOwnerId(ownerId: string): Promise<Vehicle[]> {
    const data = await this.prisma.vehicle.findMany({
      where: {
        ownerId: ownerId,
        deletedAt: null,
      },
    });

    return data.map((d) => this.toDomain(d));
  }

  async plateExists(plate: string): Promise<boolean> {
    const count = await this.prisma.vehicle.count({
      where: {
        plate,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vehicle.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Convert database record to domain entity
   */
  private toDomain(data: any): Vehicle {
    const licensePlate = LicensePlate.create(data.plate);

    return Vehicle.reconstruct(data.id, {
      plate: licensePlate,
      category: data.category,
      ownerId: data.owner_id,
      nickname: data.nickname,
      brand: data.brand,
      model: data.model,
      color: data.color,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }
}
