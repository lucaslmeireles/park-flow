import { Inject } from '@nestjs/common';
import type { VehicleRepository } from '../../domain/repositories/vehicle.repository';
import {
  VehicleAlreadyAssignedToUserException,
  VehicleNotAssignedToOrganizationMemberException,
  VehicleNotFoundException,
} from '../../domain/exceptions/vehicle.exception';
import type { OrganizationMembershipRepository } from 'src/modules/organization/domain/repositories/organization-membership.repository';

export class AssignVehicleToUserCommand {
  constructor(
    readonly vehicleId: string,
    readonly userId: string,
  ) {}
}

export class AssignVehicleToUserUseCase {
  constructor(
    @Inject('VehicleRepository') private vehicleRepository: VehicleRepository,
    @Inject('OrganizationMembershipRepository')
    private organizationMembershipRepository: OrganizationMembershipRepository,
  ) {}

  async execute(command: AssignVehicleToUserCommand): Promise<void> {
    const vehicle = await this.vehicleRepository.findById(command.vehicleId);

    if (!vehicle) {
      throw new VehicleNotFoundException(command.vehicleId);
    }

    if (vehicle.getOwnerId() !== command.userId) {
      throw new VehicleAlreadyAssignedToUserException(
        command.vehicleId,
        command.userId,
      );
    }

    const membership = await this.organizationMembershipRepository.findByUserId(
      command.userId,
    );

    if (membership) {
      throw new VehicleNotAssignedToOrganizationMemberException(
        command.vehicleId,
        membership.getProps().organizationId,
      );
    }

    vehicle.assignToOwner(command.userId);

    await this.vehicleRepository.save(vehicle);
  }
}
