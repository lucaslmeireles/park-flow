import { Inject, Injectable } from '@nestjs/common';
import type { ParkingSpotRepository } from '../../domain/repositories/parking_spot.repository';
import {
  ParkingSpotAlreadyHaveGeometry,
  ParkingSpotNotFound,
} from '../../domain/exceptions/parking_spot.exceptions';
import { GeoLocation } from '../../domain/value-objects/GeoLocation';

export class AssignParkingSpotGeometryCommand {
  constructor(
    readonly id: string,
    readonly lat: number,
    readonly lng: number,
  ) {}
}

@Injectable()
export class AssignParkingSpotGeometryUseCase {
  constructor(
    @Inject('ParkingSpotRepository')
    private readonly parkingSpotRepository: ParkingSpotRepository,
  ) {}

  async execute(command: AssignParkingSpotGeometryCommand): Promise<void> {
    const parkingSpot = await this.parkingSpotRepository.findById(command.id);

    if (!parkingSpot) {
      throw new ParkingSpotNotFound('Parking spot not found');
    }

    const geometry = GeoLocation.create(command.lat, command.lng);

    if (!parkingSpot.getGeometry()) {
      throw new ParkingSpotAlreadyHaveGeometry(
        'Parking spot already has geometry assigned',
      );
    }
    parkingSpot.assignGeometry(geometry);

    await this.parkingSpotRepository.save(parkingSpot);
  }
}
