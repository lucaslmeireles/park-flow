import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { VehicleController } from './presentation/controllers/vehicle.controller';
import { RegisterVehicleUseCase } from './application/commands/register-vehicle.use-case';
import { FindVehicleByIdUseCase } from './application/queries/find-vehicle-by-id.use-case';
import { VehicleRepository } from './domain/repositories/vehicle.repository';
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
      provide: VehicleRepository,
      useClass: PrismaVehicleRepository,
    },

    // Infrastructure
    {
      provide: PrismaClient,
      useValue: new PrismaClient(),
    },
  ],
  exports: [VehicleRepository],
})
export class VehicleModule {}
