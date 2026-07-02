import { VehicleCategory } from '@prisma/client';

/**
 * VehicleResponse DTO
 * HTTP Response contract - represents the Vehicle to the client
 * Contains only the information the API should expose
 */
export class VehicleResponse {
  id: string;
  plate: string;
  category: VehicleCategory;
  nickname?: string;
  brand?: string;
  model?: string;
  color?: string;
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(props: any): VehicleResponse {
    const response = new VehicleResponse();
    response.id = props.id;
    response.plate = props.plate;
    response.category = props.category;
    response.nickname = props.nickname;
    response.brand = props.brand;
    response.model = props.model;
    response.color = props.color;
    response.ownerId = props.ownerId;
    response.createdAt = props.createdAt;
    response.updatedAt = props.updatedAt;
    return response;
  }
}

/**
 * RegisterVehicleResponse DTO
 * Response when a vehicle is registered
 */
export class RegisterVehicleResponse {
  id: string;
  message: string;

  constructor(id: string) {
    this.id = id;
    this.message = `Vehicle registered successfully with ID: ${id}`;
  }
}
