import { Inject, Injectable } from '@nestjs/common';
import { TicketCreatorType } from 'src/generated/prisma/enums';
import type { TicketRepository } from '../../domain/repositories/ticket.repository';
import type { OrganizationMembershipRepository } from 'src/modules/organization/domain/repositories/organization-membership.repository';
import {
  TicketForbiddenException,
  TicketNotFoundException,
} from '../../domain/exceptions/ticket.exception';

export class CancelTicketCommand {
  constructor(
    readonly ticketId: string,
    readonly cancelledById: string,
    readonly cancelledType?: TicketCreatorType,
  ) {}
}

@Injectable()
export class CancelTicketUseCase {
  constructor(
    @Inject('TicketRepository') private ticketRepository: TicketRepository,
    @Inject('OrganizationMembershipRepository')
    private organizationMembershipRepository: OrganizationMembershipRepository,
  ) {}

  async execute(command: CancelTicketCommand): Promise<void> {
    const ticket = await this.ticketRepository.findById(command.ticketId);

    if (!ticket) {
      throw new TicketNotFoundException(command.ticketId);
    }

    const createdByType = ticket.getCreatorType();

    if (createdByType != TicketCreatorType.DRIVER) {
      const membership =
        await this.organizationMembershipRepository.findByUserId(
          command.cancelledById,
        );
      if (!membership) {
        throw new TicketForbiddenException(
          `User ${command.cancelledById} is not a member of the organization that created the ticket ${command.ticketId}`,
        );
      }
    }

    ticket.cancelTicket();
    await this.ticketRepository.save(ticket);
  }
}
