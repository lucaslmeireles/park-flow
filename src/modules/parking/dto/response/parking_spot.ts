export class CreateParkingSpotResponse {
  id: string;
  message: string;

  constructor(id: string) {
    this.id = id;
    this.message = `ParkingSpot created successfully with ID: ${id}`;
  }
}
