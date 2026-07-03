import { TicketStatus } from 'src/generated/prisma/enums';
import { Entity } from 'src/shared/domain/entity';

interface TicketProps {
  parkingSpotId: string;
  vehicleId: string;
  status?: TicketStatus;
  createdAt?: Date;
  updatedAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  pricingRuleId?: string;
  scheduledAt?: Date;
}

/**
 * Ticket Aggregate Root
 *
 * Represents a ticket in the parking system
 * - Every ticket must be associated with a parking spot and a vehicle
 * - Ticket owns all its business logic and validation
 */
export class Ticket extends Entity<TicketProps> {
  private parkingSpotId: string;
  private vehicleId: string;
  private status: TicketStatus;
  private startedAt?: Date;
  private endedAt?: Date;
  private pricingRuleId?: string;
  private scheduledAt?: Date;

  private constructor(id: string, props: TicketProps) {
    super(id, props.createdAt, props.updatedAt);
    this.parkingSpotId = props.parkingSpotId;
    this.vehicleId = props.vehicleId;
    this.status = props.status ?? TicketStatus.ACTIVE;
    this.startedAt = props.startedAt;
    this.endedAt = props.endedAt;
    this.pricingRuleId = props.pricingRuleId;
    this.scheduledAt = props.scheduledAt;
  }

  static create(id: string, props: TicketProps): Ticket {
    return new Ticket(id, props);
  }

  static reconstruct(id: string, props: TicketProps): Ticket {
    return new Ticket(id, props);
  }

  getParkingSpotId(): string {
    return this.parkingSpotId;
  }

  getVehicleId(): string {
    return this.vehicleId;
  }

  getStatus(): TicketStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return super.getCreatedAt();
  }

  getStartedAt(): Date | undefined {
    return this.startedAt;
  }

  getEndedAt(): Date | undefined {
    return this.endedAt;
  }

  getPricingRuleId(): string | undefined {
    return this.pricingRuleId;
  }

  getScheduledAt(): Date | undefined {
    return this.scheduledAt;
  }

  updateDetails(details: Partial<TicketProps>): void {
    if (
      this.status === TicketStatus.FINISHED ||
      this.status === TicketStatus.CANCELLED
    ) {
      throw new Error('Cannot update a ticket that is finished or cancelled');
    }

    if (details.parkingSpotId) this.parkingSpotId = details.parkingSpotId;
    if (details.vehicleId) this.vehicleId = details.vehicleId;
    if (details.status) this.status = details.status;
    if (details.startedAt) this.startedAt = details.startedAt;
    if (details.endedAt) this.endedAt = details.endedAt;
    if (details.pricingRuleId) this.pricingRuleId = details.pricingRuleId;
    if (details.scheduledAt) this.scheduledAt = details.scheduledAt;
    this.setUpdatedAt(new Date());
  }

  startTicket(): void {
    if (this.status !== TicketStatus.ACTIVE) {
      throw new Error('Cannot start a ticket that is not active');
    }
    this.startedAt = new Date();
    this.setUpdatedAt(new Date());
  }

  endTicket(): void {
    if (this.status !== TicketStatus.ACTIVE) {
      throw new Error('Cannot end a ticket that is not active');
    }
    this.endedAt = new Date();
    this.status = TicketStatus.FINISHED;
    this.setUpdatedAt(new Date());
  }

  assignVehicle(vehicleId: string): void {
    if (this.vehicleId) {
      throw new Error('Ticket is already assigned to a vehicle');
    }
    this.vehicleId = vehicleId;
    this.setUpdatedAt(new Date());
  }

  assignParkingSpot(parkingSpotId: string): void {
    if (this.parkingSpotId) {
      throw new Error('Ticket is already assigned to a parking spot');
    }
    this.parkingSpotId = parkingSpotId;
    this.setUpdatedAt(new Date());
  }

  getProps(): TicketProps {
    return {
      parkingSpotId: this.parkingSpotId,
      vehicleId: this.vehicleId,
      status: this.status,
      startedAt: this.startedAt,
      endedAt: this.endedAt,
      pricingRuleId: this.pricingRuleId,
      scheduledAt: this.scheduledAt,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }

  equals(other?: Entity<TicketProps>): boolean {
    if (!other || !(other instanceof Ticket)) {
      return false;
    }
    return this.id === other.id;
  }
}
