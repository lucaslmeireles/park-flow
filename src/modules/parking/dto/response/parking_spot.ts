import { GeoLocation } from '../../domain/value-objects/GeoLocation';

export class CreateParkingSpotResponse {
  id: string;
  message: string;

  constructor(id: string) {
    this.id = id;
    this.message = `ParkingSpot created successfully with ID: ${id}`;
  }
}

export class AssignGeometryParkingSpotResponse {
  id: string;
  message: string;
  geometry: GeoLocation;

  constructor(id: string, geometry: GeoLocation) {
    this.id = id;
    this.geometry = geometry;
    this.message = `ParkingSpot assigned to point ${geometry.toString()} successfully with ID: ${id}`;
  }
}
