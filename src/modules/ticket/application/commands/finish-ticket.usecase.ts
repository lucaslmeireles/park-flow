import { Inject, Injectable } from '@nestjs/common';
import type { TicketRepository } from '../../domain/repositories/ticket.repository';
import type { OrganizationMembershipRepository } from '../../../organization/domain/repositories/organization-membership.repository';
import {
  TicketAlreadyClosedException,
  TicketForbiddenException,
  TicketNotActiveException,
  TicketNotFoundException,
} from '../../domain/exceptions/ticket.exception';
import {
  TicketCreatorType,
  TicketStatus,
  UserRole,
} from 'src/generated/prisma/enums';

export class FinishTicketCommand {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly endedAt?: Date,
  ) {}
}

@Injectable()
export class FinishTicketUseCase {
  constructor(
    @Inject('TicketRepository')
    private ticketRepository: TicketRepository,
    @Inject('OrganizationMembershipRepository')
    private organizationMembershipRepository: OrganizationMembershipRepository,
  ) {}

  async execute(command: FinishTicketCommand): Promise<[string, Date]> {
    const ticket = await this.ticketRepository.findById(command.id);

    if (!ticket) {
      throw new TicketNotFoundException(command.id);
    }

    const membership = await this.organizationMembershipRepository.findByUserId(
      command.userId,
    );

    const isOperatorOrAdmin =
      membership?.getProps().role === UserRole.OPERATOR ||
      membership?.getProps().role === UserRole.ADMIN;

    if (ticket.getCreatorType() === TicketCreatorType.DRIVER) {
      if (ticket.getCreatedById() !== command.userId && !isOperatorOrAdmin) {
        throw new TicketForbiddenException(command.id);
      }
    } else if (!isOperatorOrAdmin) {
      throw new TicketForbiddenException(command.id);
    }

    if (ticket.getStatus() === TicketStatus.FINISHED) {
      throw new TicketAlreadyClosedException(command.id);
    }

    if (ticket.getStatus() !== TicketStatus.ACTIVE) {
      throw new TicketNotActiveException(command.id);
    }
    const endDate = command.endedAt ?? new Date();
    await this.ticketRepository.finishTicket(command.id, endDate);

    return [command.id, endDate];
  }
}
