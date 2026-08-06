import { Inject, Injectable } from '@nestjs/common';
import { TicketCreatorType, TicketStatus } from 'src/generated/prisma/enums';
import type { TicketRepository } from '../../domain/repositories/ticket.repository';
import type { OrganizationMembershipRepository } from 'src/modules/organization/domain/repositories/organization-membership.repository';
import {
  TicketForbiddenException,
  TicketNotActiveException,
  TicketNotFoundException,
} from '../../domain/exceptions/ticket.exception';

export class EditTicketCommand {
  constructor(
    readonly ticketId: string,
    readonly updatedById: string,
    readonly updatedType?: TicketCreatorType,
    readonly status?: string,
    readonly startedAt?: Date,
    readonly endedAt?: Date,
    readonly pricingRuleId?: string,
    readonly scheduledAt?: Date,
    readonly parkingSpotId?: string,
  ) {}
}

@Injectable()
export class EditTicketUseCase {
  constructor(
    @Inject('TicketRepository') private ticketRepository: TicketRepository,
    @Inject('OrganizationMembershipRepository')
    private organizationMembershipRepository: OrganizationMembershipRepository,
  ) {}

  async execute(command: EditTicketCommand): Promise<void> {
    const ticket = await this.ticketRepository.findById(command.ticketId);

    if (!ticket) {
      throw new TicketNotFoundException(command.ticketId);
    }

    if (ticket.getStatus() != TicketStatus.ACTIVE) {
      throw new TicketNotActiveException(command.ticketId);
    }

    const createdByType = ticket.getCreatorType();

    if (createdByType != TicketCreatorType.DRIVER) {
      const membership =
        await this.organizationMembershipRepository.findByUserId(
          command.updatedById,
        );
      if (!membership) {
        throw new TicketForbiddenException(
          `User ${command.updatedById} is not a member of the organization that created the ticket ${command.ticketId}`,
        );
      }

      ticket.updateDetails({
        endedAt: command.endedAt,
        startedAt: command.startedAt,
        pricingRuleId: command.pricingRuleId,
        scheduledAt: command.scheduledAt,
        parkingSpotId: command.parkingSpotId,
      });

      return await this.ticketRepository.save(ticket);
    }

    ticket.updateDetails({
      parkingSpotId: command.parkingSpotId,
      scheduledAt: command.scheduledAt,
    });
    return await this.ticketRepository.save(ticket);
  }
}
