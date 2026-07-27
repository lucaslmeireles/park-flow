import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/database/prisma.service';
import { ParkingSpotRepository } from '../../domain/repositories/parking_spot.repository';
import { ParkingSpot } from '../../domain/entities/parking_spot';
import { ParkingSpotStatus } from 'src/generated/prisma/enums';

@Injectable()
export class PrismaParkingSpotRepository implements ParkingSpotRepository {
  constructor(private prisma: PrismaService) {}
  async save(parking_spot: ParkingSpot): Promise<void> {
    const props = parking_spot.getProps();
    await this.prisma.parkingSpot.upsert({
      where: {
        id: parking_spot.getId(),
      },
      update: {
        deletedAt: props.deletedAt,
        identifier: props.identifier,
        spotType: props.spotType,
        status: props.status,
        sensorId: props.sensorId,
      },
      create: {
        id: parking_spot.getId(),
        identifier: props.identifier,
        spotType: props.spotType,
        status: props.status,
        sensorId: props.sensorId,
        parkingZoneId: props.parkingZoneId,
      },
    });
  }

  async findById(id: string): Promise<ParkingSpot | null> {
    const data = await this.prisma.parkingSpot.findFirst({
      where: {
        id,
      },
    });

    if (!data) {
      return null;
    }

    return this.toDomain(data);
  }

  async findByParkingZoneId(id: string): Promise<ParkingSpot[] | null> {
    const data = await this.prisma.parkingSpot.findMany({
      where: {
        parkingZoneId: id,
      },
    });

    if (!data) {
      return null;
    }

    return data.map((parking_spot) => this.toDomain(parking_spot));
  }

  async findByStatus(status: ParkingSpotStatus): Promise<ParkingSpot[] | null> {
    const data = await this.prisma.parkingSpot.findMany({
      where: {
        status: status,
      },
    });

    if (!data) {
      return null;
    }

    return data.map((parking_spot) => this.toDomain(parking_spot));
  }

  async assignGeometry(id: string, geometry: string): Promise<void> {
    await console.log('Não implementei');
  }

  private toDomain(data: any): ParkingSpot {
    return ParkingSpot.reconstruct(data.id, {
      identifier: data.identifier,
      spotType: data.spotType,
      status: data.status,
      parkingZoneId: data.parkingZoneId,
    });
  }
}
