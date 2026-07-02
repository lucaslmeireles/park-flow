import { IsString, IsUUID, IsDateString } from 'class-validator';

/**
 * CreateTicketRequest DTO
 * HTTP Request contract for creating a new ticket
 * DTOs are responsible for input validation through decorators
 */
export class CreateTicketRequest {
  @IsString()
  @IsUUID()
  parkingSpotId: string;

  @IsString()
  @IsUUID()
  vehicleId: string;

  @IsDateString()
  startedAt: string;
}
