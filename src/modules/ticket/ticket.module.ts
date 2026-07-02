import { Module } from '@nestjs/common';
import { TicketController } from './presentation/controllers/ticket.controller';
import { CreateTicketUseCase } from './application/commands/create-ticket-use-case';
import { PrismaTicketRepository } from './infrastructure/repositories/prisma-ticket.repository';

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
  controllers: [TicketController],
  providers: [
    // Use Cases
    CreateTicketUseCase,

    // Repository Implementation
    {
      provide: TicketRepository,
      useClass: PrismaTicketRepository,
    },

    // Infrastructure
  ],
  exports: [TickerRepository],
})
export class VehicleModule {}
