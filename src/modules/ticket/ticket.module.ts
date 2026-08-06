import { Module } from '@nestjs/common';
import { TicketController } from './presentation/controllers/ticket.controller';
import { CreateTicketUseCase } from './application/commands/create-ticket-use-case';
import { PrismaTicketRepository } from './infrastructure/repositories/prisma-ticket.repository';
import { OrganizationModule } from '../organization/organization.module';
import { FinishTicketUseCase } from './application/commands/finish-ticket.usecase';
import { GetTicketsQueryHandler } from './application/queries/get_ticktes.query';

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
  imports: [OrganizationModule],
  controllers: [TicketController],
  providers: [
    // Use Cases
    CreateTicketUseCase,
    FinishTicketUseCase,
    GetTicketsQueryHandler,
    // Repository Implementation
    {
      provide: 'TicketRepository',
      useClass: PrismaTicketRepository,
    },

    // Infrastructure
  ],
  exports: ['TicketRepository'],
})
export class TicketModule {}
