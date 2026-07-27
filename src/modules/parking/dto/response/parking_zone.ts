export class CreateParkingZoneResponse {
  id: string;
  message: string;

  constructor(id: string) {
    this.id = id;
    this.message = `ParkingZone created successfully with ID: ${id}`;
  }
}
