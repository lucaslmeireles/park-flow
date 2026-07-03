import { Module } from '@nestjs/common';
import { VehicleController } from './presentation/controllers/vehicle.controller';
import { RegisterVehicleUseCase } from './application/commands/register-vehicle.use-case';
import { FindVehicleByIdUseCase } from './application/queries/find-vehicle-by-id.use-case';
import { PrismaVehicleRepository } from './infrastructure/repositories/prisma-vehicle.repository';

/**
 * VehicleModule
 *
 * Encapsulates all vehicle-related functionality
 * - Controllers (API endpoints)
 * - Use Cases (business orchestration)
 * - Domain (business rules)
 * - Infrastructure (database access)
 *
 * This module is self-contained and can be imported into the main app module
 */
@Module({
  controllers: [VehicleController],
  providers: [
    // Use Cases
    RegisterVehicleUseCase,
    FindVehicleByIdUseCase,

    // Repository Implementation
    {
      provide: 'VehicleRepository',
      useClass: PrismaVehicleRepository,
    },
  ],
  exports: ['VehicleRepository'],
})
export class VehicleModule {}
