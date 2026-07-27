import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateTicketCommand,
  CreateTicketUseCase,
} from '../../application/commands/create-ticket-use-case';
import { CreateTicketRequest } from '../../dto/request/createticket.dto';
import {
  CreateTicketResponse,
  FinishTicketResponse,
} from '../../dto/response/ticket.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import type { JwtPayload } from 'src/modules/identity/infrastructure/strategies/jwt.strategy';
import { FinishTicketRequestDto } from '../../dto/request/finishticket.dto';
import {
  FinishTicketCommand,
  FinishTicketUseCase,
} from '../../application/commands/finish-ticket.usecase';

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
@UseGuards(AuthGuard('jwt'))
@Controller('tickets')
export class TicketController {
  constructor(
    private createTicketUseCase: CreateTicketUseCase,
    private finishTicketUseCase: FinishTicketUseCase,
  ) {}

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
