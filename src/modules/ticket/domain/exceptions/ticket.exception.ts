/**
 * Business exception for Ticket domain
 * Thrown when a ticket violates domain rules
 */
export class TicketException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TicketException';
  }
}

export class TicketAlreadyExistsException extends TicketException {
  constructor(id: string) {
    super(`Ticket with id "${id}" already exists`);
    this.name = 'TicketAlreadyExistsException';
  }
}

export class TicketNotFoundException extends TicketException {
  constructor(id: string) {
    super(`Ticket with id "${id}" not found`);
    this.name = 'TicketNotFoundException';
  }
}

export class TicketNotActiveException extends TicketException {
  constructor(id: string) {
    super(`Ticket with id "${id}" not active`);
    this.name = 'TicketNotActiveException';
  }
}
export class TicketAlreadyClosedException extends TicketException {
  constructor(id: string) {
    super(`Ticket with id "${id}" is already closed`);
    this.name = 'TicketAlreadyClosedException';
  }
}

export class VehicleHasActiveTicketException extends TicketException {
  constructor(vehicleId: string) {
    super(`Vehicle with id "${vehicleId}" already has an active ticket`);
    this.name = 'VehicleHasActiveTicketException';
  }
}

export class ParkingSpotHasActiveTicketException extends TicketException {
  constructor(parkingSpotId: string) {
    super(
      `Parking spot with id "${parkingSpotId}" already has an active ticket`,
    );
    this.name = 'ParkingSpotHasActiveTicketException';
  }
}
