import { Inject, Injectable } from '@nestjs/common';
import { OperationMode } from 'src/generated/prisma/enums';
import type { ParkingZoneRepository } from '../../domain/repositories/parking_zone.repository';
import { ParkingZone } from '../../domain/entities/parking_zone';

export class CreateParkZoneCommand {
  constructor(
    public readonly organizationId: string,
    public readonly active: boolean,
    public readonly displayAddress: string,
    public readonly displayName: string,
    public readonly operationMode: OperationMode,
    public readonly capacity?: number,
  ) {}
}

@Injectable()
export class CreateParkZoneUseCase {
  constructor(
    @Inject('ParkingZoneRepository')
    private parkingZoneRepository: ParkingZoneRepository,
  ) {}

  async execute(command: CreateParkZoneCommand): Promise<ParkingZone> {
    const parkingZone = ParkingZone.create(
      '',
      command.active,
      command.capacity,
      command.displayName,
      command.displayAddress,
      command.organizationId,
      command.operationMode,
    );

    await this.parkingZoneRepository.save(parkingZone);
    return parkingZone;
  }
}
