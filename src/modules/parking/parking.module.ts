import { Module } from '@nestjs/common';
import { ParkingZoneController } from './presentation/controllers/parking_zone.controller';
import { CreateParkingZoneUseCase } from './application/commands/create_parking_zone.usecase';
import { PrismaParkingZoneRepository } from './infrastructure/repositories/parking_zone.prisma';
import { PrismaParkingSpotRepository } from './infrastructure/repositories/parking_spot.prisma';
import { CreateParkingSpotUseCase } from './application/commands/create_parking_spot.usecase';
import { PrismaOrganizationRepository } from '../organization/infrastructure/repositories/prisma-organization.repository';
import { ParkingSpotController } from './presentation/controllers/parking_spot.controller';

@Module({
  controllers: [ParkingZoneController, ParkingSpotController],
  providers: [
    // Use Cases
    CreateParkingZoneUseCase,
    CreateParkingSpotUseCase,

    // Repository Implementation
    {
      provide: 'ParkingZoneRepository',
      useClass: PrismaParkingZoneRepository,
    },
    {
      provide: 'ParkingSpotRepository',
      useClass: PrismaParkingSpotRepository,
    },
    {
      provide: 'OrganizationRepository',
      useClass: PrismaOrganizationRepository,
    },
  ],
  exports: ['ParkingZoneRepository', 'ParkingSpotRepository'],
})
export class ParkingModule {}
