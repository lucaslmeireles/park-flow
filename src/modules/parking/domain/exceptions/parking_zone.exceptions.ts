export class ParkingZoneException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParkingZoneException';
  }
}

export class ParkingZoneNotFound extends ParkingZoneException {
  constructor(message: string) {
    super(message);
  }
}

export class ParkingZoneAlreadtExists extends ParkingZoneException {
  constructor(message: string) {
    super(message);
  }
}

export class ParkingZoneOrganizationNotFound extends ParkingZoneException {
  constructor(message: string) {
    super(message);
  }
}

export class ParkingZoneOrganizationNotActive extends ParkingZoneException {
  constructor(message: string) {
    super(message);
  }
}

export class ParkingZoneNotActiveException extends ParkingZoneException {
  constructor(parkingZoneId: string) {
    super(`Parking Zone ${parkingZoneId} is not active`);
  }
}
