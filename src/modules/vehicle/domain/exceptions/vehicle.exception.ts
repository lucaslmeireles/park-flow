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

export class VehicleNotAssignedToUserException extends VehicleException {
  constructor(vehicleId: string, userId: string) {
    super(
      `Vehicle with id "${vehicleId}" is not assigned to user with id "${userId}"`,
    );
    this.name = 'VehicleNotAssignedToUserException';
  }
}

export class VehicleAlreadyAssignedToUserException extends VehicleException {
  constructor(vehicleId: string, userId: string) {
    super(
      `Vehicle with id "${vehicleId}" is already assigned to user with id "${userId}"`,
    );
    this.name = 'VehicleAlreadyAssignedToUserException';
  }
}

export class VehicleNotAssignedToOrganizationMemberException extends VehicleException {
  constructor(vehicleId: string, organizationId: string) {
    super(
      `Vehicle with id "${vehicleId}" can not be assigned to organization member with id "${organizationId}"`,
    );
    this.name = 'VehicleNotAssignedToOrganizationException';
  }
}

export class VehicleNotOwnedByUserException extends VehicleException {
  constructor(vehicleId: string, userId: string) {
    super(
      `Vehicle with id "${vehicleId}" is not owned by user with id "${userId}"`,
    );
    this.name = 'VehicleNotOwnedByUserException';
  }
}
