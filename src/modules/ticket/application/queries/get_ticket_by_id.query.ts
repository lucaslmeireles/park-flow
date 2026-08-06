import { Inject, Injectable } from '@nestjs/common';
import type { TicketRepository } from '../../domain/repositories/ticket.repository';

export class GetTicketByIdQuery {
  constructor(public readonly id: string) {}
}

@Injectable()
export class GetTicketByIdQueryHandler {
  constructor(
    @Inject('TicketRepository') private ticketRepository: TicketRepository,
  ) {}

  async execute(query: GetTicketByIdQuery) {
    const ticket = await this.ticketRepository.findById(query.id);
    return ticket;
  }
}
