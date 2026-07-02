import { VehicleCategory } from '@prisma/client';

/**
 * VehicleResponse DTO
 * HTTP Response contract - represents the Vehicle to the client
 * Contains only the information the API should expose
 */
export class TicketResponse {
  id: string;
  parkingSpotId: string;
  vehicleId: string;
  status: 'active' | 'closed' | 'cancelled';
  startedAt?: Date;
  endedAt?: Date;
  pricingRuleId?: string;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(props: any): TicketResponse {
    const response = new TicketResponse();
    response.id = props.id;
    response.parkingSpotId = props.parkingSpotId;
    response.vehicleId = props.vehicleId;
    response.status = props.status;
    response.startedAt = props.startedAt;
    response.endedAt = props.endedAt;
    response.pricingRuleId = props.pricingRuleId;
    response.scheduledAt = props.scheduledAt;
    response.createdAt = props.createdAt;
    response.updatedAt = props.updatedAt;
    return response;
  }
}

/**
 * CreateTicketResponse DTO
 * Response when a ticket is created
 */
export class CreateTicketResponse {
  id: string;
  message: string;

  constructor(id: string) {
    this.id = id;
    this.message = `Ticket created successfully with ID: ${id}`;
  }
}
