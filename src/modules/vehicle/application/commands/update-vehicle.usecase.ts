import { Inject } from '@nestjs/common';
import { VehicleCategory } from 'src/generated/prisma/enums';
import type { VehicleRepository } from '../../domain/repositories/vehicle.repository';
import { VehicleNotFoundException } from '../../domain/exceptions/vehicle.exception';

export class UpdateVehicleCommand {
  constructor(
    readonly category: VehicleCategory,
    readonly nickname?: string,
    readonly brand?: string,
    readonly model?: string,
    readonly color?: string,
  ) {}
}

export class UpdateVehicleUseCase {
  constructor(
    @Inject('VehicleRepository') private vehicleRepository: VehicleRepository,
  ) {}

  async execute(
    vehicleId: string,
    command: UpdateVehicleCommand,
  ): Promise<void> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);

    if (!vehicle) {
      throw new VehicleNotFoundException(vehicleId);
    }

    vehicle.updateDetails({
      brand: command.brand,
      model: command.model,
      color: command.color,
      nickname: command.nickname,
    });

    vehicle.updateCategory(command.category);

    await this.vehicleRepository.save(vehicle);
  }
}
