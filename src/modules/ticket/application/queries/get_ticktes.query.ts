import { Inject, Injectable } from '@nestjs/common';
import { TicketStatus } from 'src/generated/prisma/enums';
import type { TicketRepository } from '../../domain/repositories/ticket.repository';
import { Ticket } from '../../domain/entities/ticket';

export class GetTicketsQuery {
  constructor(public readonly status?: TicketStatus) {}
}

@Injectable()
export class GetTicketsQueryHandler {
  constructor(
    @Inject('TicketRepository') private ticketRepository: TicketRepository,
  ) {}
  async execute(query: GetTicketsQuery): Promise<Ticket[]> {
    if (query.status) {
      const tickets = await this.ticketRepository.findByStatus(query.status);
      return tickets;
    }
    const tickets = await this.ticketRepository.findAll();
    return tickets;
  }
}
