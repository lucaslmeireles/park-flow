import { Injectable } from '@nestjs/common';
import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { Ticket } from '../../domain/entities/ticket';
import { TicketStatus } from '@prisma/client';
import {
  ParkingSpotHasActiveTicketException,
  VehicleHasActiveTicketException,
} from '../../domain/exceptions/ticket.exception';

/**
 * CreateTicketCommand
 * Data Transfer Object for creating a new ticket
 */
export class CreateTicketCommand {
  constructor(
    readonly parkingSpotId: string,
    readonly vehicleId: string,
    readonly startedAt?: Date,
    readonly endedAt?: Date,
    readonly status?: TicketStatus,
    readonly pricingRuleId?: string,
    readonly scheduledAt?: Date,
  ) {}
}

/**
 * CreateTicketUseCase
 *
 * Application Service that orchestrates the creation of a new ticket
 * Responsibilities:
 * - Validate input
 * - Check business rules
 * - Create the Ticket aggregate
 * - Persist it through the repository
 * - Return the created ticket ID
 *
 * No business logic here - that's in the domain layer!
 */
@Injectable()
export class CreateTicketUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(command: CreateTicketCommand): Promise<string> {
    const id = crypto.randomUUID();

    const ticket = Ticket.create(id, {
      parkingSpotId: command.parkingSpotId,
      vehicleId: command.vehicleId,
      startedAt: command.startedAt,
      endedAt: command.endedAt,
      status: command.status ?? TicketStatus.ACTIVE,
      pricingRuleId: command.pricingRuleId,
      scheduledAt: command.scheduledAt,
    });

    if (await this.ticketRepository.vehicleHasActiveTicket(command.vehicleId)) {
      throw new VehicleHasActiveTicketException(command.vehicleId);
    }

    if (
      await this.ticketRepository.parkingSpotHasActiveTicket(
        command.parkingSpotId,
      )
    ) {
      throw new ParkingSpotHasActiveTicketException(command.parkingSpotId);
    }

    await this.ticketRepository.save(ticket);
    return id;
  }
}
