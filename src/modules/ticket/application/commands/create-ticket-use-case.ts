import { Inject, Injectable } from '@nestjs/common';
import type { TicketRepository } from '../../domain/repositories/ticket.repository';
import type { OrganizationMembershipRepository } from '../../../organization/domain/repositories/organization-membership.repository';
import { Ticket } from '../../domain/entities/ticket';

import {
  ParkingSpotHasActiveTicketException,
  VehicleHasActiveTicketException,
} from '../../domain/exceptions/ticket.exception';
import { TicketCreatorType, TicketStatus } from 'src/generated/prisma/enums';
import { v4 as uuid } from 'uuid';
/**
 * CreateTicketCommand
 * Data Transfer Object for creating a new ticket
 */
export class CreateTicketCommand {
  constructor(
    readonly parkingSpotId: string,
    readonly vehicleId: string,
    readonly startedAt: Date,
    readonly createdById: string,
    readonly creatorType?: TicketCreatorType,
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
  constructor(
    @Inject('TicketRepository')
    private ticketRepository: TicketRepository,
    @Inject('OrganizationMembershipRepository')
    private organizationMembershipRepository: OrganizationMembershipRepository,
  ) {}

  async execute(command: CreateTicketCommand): Promise<string> {
    const id = uuid();

    const membership = await this.organizationMembershipRepository.findByUserId(
      command.createdById,
    );

    const creatorType =
      command.creatorType ??
      (membership ? TicketCreatorType.OPERATOR : TicketCreatorType.DRIVER);

    const ticket = Ticket.create(id, {
      parkingSpotId: command.parkingSpotId,
      vehicleId: command.vehicleId,
      createdById: command.createdById,
      creatorType,
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
