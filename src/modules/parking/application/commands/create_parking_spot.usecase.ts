import { Inject, Injectable } from '@nestjs/common';
import { ParkingSpotStatus, ParkingSpotType } from 'src/generated/prisma/enums';
import { v4 as uuid } from 'uuid';
import type { ParkingSpotRepository } from '../../domain/repositories/parking_spot.repository';
import type { ParkingZoneRepository } from '../../domain/repositories/parking_zone.repository';
import { ParkingSpot } from '../../domain/entities/parking_spot';
import { ParkingZoneNotActiveException } from '../../domain/exceptions/parking_zone.exceptions';
export class CreateParkingSpotCommand {
  constructor(
    public readonly parkingZoneId: string,
    public readonly identifier: string,
    public readonly spotType: ParkingSpotType,
    public readonly status: ParkingSpotStatus,
    public readonly sensorId?: string,
  ) {}
}

@Injectable()
export class CreateParkingSpotUseCase {
  constructor(
    @Inject('ParkingSpotRepository')
    private parkingSpotRepository: ParkingSpotRepository,
    @Inject('ParkingZoneRepository')
    private parkingZoneRepository: ParkingZoneRepository,
  ) {}

  async execute(command: CreateParkingSpotCommand): Promise<ParkingSpot> {
    const parkingZone = await this.parkingZoneRepository.findById(
      command.parkingZoneId,
    );

    if (!parkingZone) {
      throw new Error(`Parking Zone ${command.parkingZoneId} not found`);
    }

    if (!parkingZone.isActive()) {
      throw new ParkingZoneNotActiveException(command.parkingZoneId);
    }

    const id = uuid();
    const parkingSpot = ParkingSpot.create(
      id,
      command.parkingZoneId,
      command.identifier,
      command.spotType,
      command.status,
    );

    await this.parkingSpotRepository.save(parkingSpot);
    return parkingSpot;
  }
}
