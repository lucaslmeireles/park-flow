import { Inject } from '@nestjs/common';
import type { VehicleRepository } from '../../domain/repositories/vehicle.repository';
import type { OrganizationMembershipRepository } from 'src/modules/organization/domain/repositories/organization-membership.repository';
import {
  VehicleNotFoundException,
  VehicleNotOwnedByUserException,
} from '../../domain/exceptions/vehicle.exception';

export class DeleteVehicleCommand {
  constructor(
    readonly vehicleId: string,
    readonly userId: string,
  ) {}
}

export class DeleteVehicleUseCase {
  constructor(
    @Inject('VehicleRepository') private vehicleRepository: VehicleRepository,
    @Inject('OrganizationMembershipRepository')
    private organizationMembershipRepository: OrganizationMembershipRepository,
  ) {}

  async execute(command: DeleteVehicleCommand): Promise<void> {
    const vehicle = await this.vehicleRepository.findById(command.vehicleId);

    if (!vehicle) {
      throw new VehicleNotFoundException(command.vehicleId);
    }

    if (vehicle.getOwnerId() !== command.userId) {
      throw new VehicleNotOwnedByUserException(
        command.vehicleId,
        command.userId,
      );
    }

    const membership = await this.organizationMembershipRepository.findByUserId(
      command.userId,
    );

    if (membership) {
      // Audit log the user who deleted the vehicle and the organization they belong to
    }

    await this.vehicleRepository.delete(vehicle.getId());
  }
}
