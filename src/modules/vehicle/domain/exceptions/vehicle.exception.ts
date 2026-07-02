/**
 * Business exception for Vehicle domain
 * Thrown when a vehicle violates domain rules
 */
export class VehicleException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VehicleException';
  }
}

export class VehiclePlateAlreadyExistsException extends VehicleException {
  constructor(plate: string) {
    super(`Vehicle with plate "${plate}" already exists`);
    this.name = 'VehiclePlateAlreadyExistsException';
  }
}

export class VehicleNotFoundException extends VehicleException {
  constructor(id: string) {
    super(`Vehicle with id "${id}" not found`);
    this.name = 'VehicleNotFoundException';
  }
}

export class VehicleHasActiveTicketException extends VehicleException {
  constructor(id: string) {
    super(`Vehicle with id "${id}" has an active ticket`);
    this.name = 'VehicleHasActiveTicketException';
  }
}
