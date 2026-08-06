import { Inject } from '@nestjs/common';
import type { VehicleRepository } from '../../domain/repositories/vehicle.repository';
import { VehicleNotFoundException } from '../../domain/exceptions/vehicle.exception';

export class FindVehicleByPlateQuery {
  constructor(readonly plate: string) {}
}

export class FindVehicleByPlateQueryHandler {
  constructor(
    @Inject('VehicleRepository') private vehicleRepository: VehicleRepository,
  ) {}

  async execute(query: FindVehicleByPlateQuery) {
    const vehicle = await this.vehicleRepository.findByPlate(query.plate);

    if (!vehicle) {
      throw new VehicleNotFoundException(query.plate);
    }

    return vehicle;
  }
}
