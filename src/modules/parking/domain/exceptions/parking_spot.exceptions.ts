export class ParkingSpotException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParkingSpotException';
  }
}

export class ParkingSpotNotFound extends ParkingSpotException {
  constructor(message: string) {
    super(message);
  }
}

export class ParkingSpotAlreadyHaveGeometry extends ParkingSpotException {
  constructor(message: string) {
    super(message);
  }
}
