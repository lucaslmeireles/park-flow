import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateTicketCommand,
  CreateTicketUseCase,
} from '../../application/commands/create-ticket-use-case';
import {
  FinishTicketCommand,
  FinishTicketUseCase,
} from '../../application/commands/finish-ticket.usecase';
import {
  GetTicketsQuery,
  GetTicketsQueryHandler,
} from '../../application/queries/get_ticktes.query';
import { TicketStatus } from 'src/generated/prisma/enums';
import {
  CreateTicketResponse,
  FinishTicketResponse,
  TicketResponse,
} from '../../dto/response/ticket.dto';
import { PaginatedResponse } from 'src/shared/dto/paginated-response.dto';
import { CreateTicketRequest } from '../../dto/request/createticket.dto';
import type { JwtPayload } from 'src/modules/identity/infrastructure/strategies/jwt.strategy';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { FinishTicketRequestDto } from '../../dto/request/finishticket.dto';

/**
 *
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
@UseGuards(AuthGuard('jwt'))
@Controller('tickets')
export class TicketController {
  constructor(
    private createTicketUseCase: CreateTicketUseCase,
    private finishTicketUseCase: FinishTicketUseCase,
    private getTicketsQueryHandler: GetTicketsQueryHandler,
  ) {}

  @Get('')
  async getTickets(
    @Query('status') status?: string,
  ): Promise<PaginatedResponse<TicketResponse>> {
    if (
      status !== undefined &&
      !Object.values(TicketStatus).includes(status as TicketStatus)
    ) {
      throw new BadRequestException(
        `status must be one of: ${Object.values(TicketStatus).join(', ')}`,
      );
    }

    const query = new GetTicketsQuery(status as TicketStatus | undefined);
    const tickets = await this.getTicketsQueryHandler.execute(query);
    const ticketResponses = tickets.map((ticket) =>
      TicketResponse.fromEntity(ticket),
    );
    return new PaginatedResponse(ticketResponses, ticketResponses.length);
  }
  /**
   * POST /tickets
   * Create a new ticket
   */
  @Post()
  async create(
    @Body() request: CreateTicketRequest,
    @CurrentUser() user: JwtPayload,
  ): Promise<CreateTicketResponse> {
    const command = new CreateTicketCommand(
      request.parkingSpotId,
      request.vehicleId,
      new Date(request.startedAt),
      user.sub,
    );

    const ticketId = await this.createTicketUseCase.execute(command);

    return new CreateTicketResponse(ticketId);
  }

  @Post(':id/finish')
  async finishTicket(
    @Param('id') id: string,
    @Body() request: FinishTicketRequestDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<FinishTicketResponse> {
    console.log(user);
    const endedAt = request.endedAt ? new Date(request.endedAt) : new Date();
    const command = new FinishTicketCommand(id, user.sub, endedAt);
    const [ticketId, endendAt] =
      await this.finishTicketUseCase.execute(command);
    return new FinishTicketResponse(ticketId, endendAt);
  }
}
