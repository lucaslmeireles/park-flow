import { Inject, Injectable } from '@nestjs/common';
import type { VehicleRepository } from '../../domain/repositories/vehicle.repository';
import { Vehicle } from '../../domain/entities/vehicle';
import { VehicleNotFoundException } from '../../domain/exceptions/vehicle.exception';

/**
 * FindVehicleByIdUseCase
 *
 * Query Use Case that retrieves a vehicle by ID
 * Queries don't modify state, they just return data
 */
@Injectable()
export class FindVehicleByIdUseCase {
  constructor(
    @Inject('VehicleRepository')
    private vehicleRepository: VehicleRepository,
  ) {}

  async execute(vehicleId: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);

    if (!vehicle) {
      throw new VehicleNotFoundException(vehicleId);
    }

    return vehicle;
  }
}
