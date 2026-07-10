import { Injectable } from '@nestjs/common';
import type { ParkingZoneRepository } from '../../domain/repositories/parking_zone.repository';
import { ParkingZone } from '../../domain/entities/parking_zone';
import { PrismaService } from 'src/config/database/prisma.service';
import { OperationMode } from 'src/generated/prisma/enums';

@Injectable()
export class PrismaParkingZoneRepository implements ParkingZoneRepository {
  constructor(private prisma: PrismaService) {}
  async save(parking_zone: ParkingZone): Promise<void> {
    const props = parking_zone.getProps();
    await this.prisma.parkingZone.upsert({
      where: {
        id: parking_zone.getId(),
      },
      update: {
        deletedAt: props.deletedAt,
        displayAddress: props.displayAddress,
        displayName: props.displayName,
        active: props.active,
        capacity: props.capacity,
        operationMode: props.operationMode,
      },
      create: {
        active: props.active,
        displayAddress: props.displayAddress,
        displayName: props.displayName,
        capacity: props.capacity ?? 0,
        operationMode: props.operationMode,
        organizationId: props.organizationId,
      },
    });
  }

  async findByActive(active: boolean): Promise<ParkingZone[] | null> {
    const data = await this.prisma.parkingZone.findMany({
      where: {
        active,
        deletedAt: null,
      },
    });

    if (!data || data === null) {
      return null;
    }

    return data.map((parking_zone) => this.toDomain(parking_zone));
  }

  async findById(id: string): Promise<ParkingZone | null> {
    const data = await this.prisma.parkingZone.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!data || data === null) {
      return null;
    }

    return this.toDomain(data);
  }

  async findByOrgId(org_id: string): Promise<ParkingZone[] | null> {
    const data = await this.prisma.parkingZone.findMany({
      where: {
        organizationId: org_id,
        deletedAt: null,
      },
    });

    if (!data || data === null) {
      return null;
    }

    return data.map((parking_zone) => this.toDomain(parking_zone));
  }

  async findByOperationMode(
    mode: OperationMode,
  ): Promise<ParkingZone[] | null> {
    const data = await this.prisma.parkingZone.findMany({
      where: {
        operationMode: mode,
        deletedAt: null,
      },
    });

    if (!data || data === null) {
      return null;
    }

    return data.map((parking_zone) => this.toDomain(parking_zone));
  }

  assignGeometry(id: string, geometry: string): Promise<void> {
    console.log('Not implemented');
    return;
  }

  private toDomain(data: any): ParkingZone {
    return ParkingZone.reconstruct(data.id, {
      active: data.active,
      displayAddress: data.displayAddress,
      displayName: data.displayName,
      operationMode: data.operationMode,
      organizationId: data.organizationId,
      capacity: data.capacity,
      createdAt: data.createdAt,
      deletedAt: data.deletedAt,
      updatedAt: data.updatedAt,
    });
  }
}
