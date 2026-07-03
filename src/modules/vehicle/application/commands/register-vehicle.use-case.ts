import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import type { VehicleRepository } from '../../domain/repositories/vehicle.repository';
import { Vehicle } from '../../domain/entities/vehicle';
import { LicensePlate } from '../../domain/value-objects/license-plate';
import {
  VehiclePlateAlreadyExistsException,
  VehicleException,
} from '../../domain/exceptions/vehicle.exception';
import { VehicleCategory } from 'src/generated/prisma/enums';

/**
 * RegisterVehicleCommand
 * Data Transfer Object for registering a new vehicle
 */
export class RegisterVehicleCommand {
  constructor(
    readonly plate: string,
    readonly category: VehicleCategory,
    readonly ownerId?: string,
    readonly nickname?: string,
    readonly brand?: string,
    readonly model?: string,
    readonly color?: string,
  ) {}
}

/**
 * RegisterVehicleUseCase
 *
 * Application Service that orchestrates the creation of a new vehicle
 * Responsibilities:
 * - Validate input
 * - Check business rules (plate uniqueness)
 * - Create the Vehicle aggregate
 * - Persist it through the repository
 * - Return the created vehicle ID
 *
 * No business logic here - that's in the domain layer!
 */
@Injectable()
export class RegisterVehicleUseCase {
  constructor(
    @Inject('VehicleRepository')
    private vehicleRepository: VehicleRepository,
  ) {}

  async execute(command: RegisterVehicleCommand): Promise<string> {
    // 1. Create the license plate value object (this validates the format)
    let licensePlate: LicensePlate;
    try {
      licensePlate = LicensePlate.create(command.plate);
    } catch (error) {
      throw new VehicleException(`Invalid plate: ${error.message}`);
    }

    // 2. Check if plate already exists (BR-010)
    const plateExists = await this.vehicleRepository.plateExists(
      licensePlate.toString(),
    );
    if (plateExists) {
      throw new VehiclePlateAlreadyExistsException(licensePlate.toString());
    }

    // 3. Create the Vehicle aggregate
    const vehicleId = uuid();
    const vehicle = Vehicle.create(vehicleId, licensePlate, command.category, {
      ownerId: command.ownerId,
      nickname: command.nickname,
      brand: command.brand,
      model: command.model,
      color: command.color,
    });

    // 4. Persist through repository
    await this.vehicleRepository.save(vehicle);

    // 5. Return the created ID
    return vehicleId;
  }
}
