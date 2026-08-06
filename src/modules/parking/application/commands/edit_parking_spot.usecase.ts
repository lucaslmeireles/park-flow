import { ParkingSpotStatus, ParkingSpotType } from 'src/generated/prisma/enums';
import type { ParkingSpotRepository } from '../../domain/repositories/parking_spot.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ParkingSpotNotFound } from '../../domain/exceptions/parking_spot.exceptions';

export class EditParkingSpotCommand {
  constructor(
    readonly parkingSpotId: string,
    readonly identifier: string,
    readonly status: ParkingSpotStatus,
    readonly spotType: ParkingSpotType,
    readonly updatedById: string,
  ) {}
}

@Injectable()
export class EditParkingSpotUseCase {
  constructor(
    @Inject('ParkingSpotRepository')
    private parkingSpotRepository: ParkingSpotRepository,
  ) {}

  async execute(command: EditParkingSpotCommand): Promise<void> {
    const parkingSpot = await this.parkingSpotRepository.findById(
      command.parkingSpotId,
    );

    if (!parkingSpot) {
      throw new ParkingSpotNotFound(
        `Parking spot with ID ${command.parkingSpotId} not found`,
      );
    }

    parkingSpot.updateDetails({
      identifier: command.identifier,
      status: command.status,
      spotType: command.spotType,
    });
  }
}
