import { Inject, Injectable } from '@nestjs/common';
import { OperationMode } from 'src/generated/prisma/enums';
import type { ParkingZoneRepository } from '../../domain/repositories/parking_zone.repository';
import { ParkingZone } from '../../domain/entities/parking_zone';
import { v4 as uuid } from 'uuid';
import type { OrganizationRepository } from 'src/modules/organization/domain/repositories/organization.repository';
import {
  ParkingZoneOrganizationNotActive,
  ParkingZoneOrganizationNotFound,
} from '../../domain/exceptions/parking_zone.exceptions';
export class CreateParkingZoneCommand {
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
export class CreateParkingZoneUseCase {
  constructor(
    @Inject('ParkingZoneRepository')
    private parkingZoneRepository: ParkingZoneRepository,
    @Inject('OrganizationRepository')
    private organizationRepository: OrganizationRepository,
  ) {}

  async execute(command: CreateParkingZoneCommand): Promise<ParkingZone> {
    const id = uuid();
    const organization = await this.organizationRepository.findById(
      command.organizationId,
    );
    if (!organization) {
      throw new ParkingZoneOrganizationNotFound('Organization Not Founded');
    }
    if (!organization.isActive()) {
      throw new ParkingZoneOrganizationNotActive('Organization Not Active');
    }

    const parkingZone = ParkingZone.create(
      id,
      command.active,
      command.capacity ?? 0,
      command.displayName,
      command.displayAddress,
      command.organizationId,
      command.operationMode,
    );
    await this.parkingZoneRepository.save(parkingZone);
    return parkingZone;
  }
}
