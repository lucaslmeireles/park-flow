import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateTicketCommand,
  CreateTicketUseCase,
} from '../../application/commands/create-ticket-use-case';
import { CreateTicketRequest } from '../../dto/request/createticket.dto';
import { CreateTicketResponse } from '../../dto/response/ticket.dto';

/**
 * TicketController
 *
 * HTTP Presentation Layer
 * Responsibilities:
 * - Accept HTTP requests
 * - Convert HTTP ↔ DTO
 * - Call use cases
 * - Return HTTP responses
 *
 * NO business logic here!
 */
@Controller('tickets')
export class TicketController {
  constructor(private createTicketUseCase: CreateTicketUseCase) {}

  /**
   * POST /tickets
   * Create a new ticket
   */
  @Post()
  async create(
    @Body() request: CreateTicketRequest,
  ): Promise<CreateTicketResponse> {
    const command = new CreateTicketCommand(
      request.parkingSpotId,
      request.vehicleId,
      new Date(request.startedAt),
    );

    const ticketId = await this.createTicketUseCase.execute(command);

    return new CreateTicketResponse(ticketId);
  }
}
