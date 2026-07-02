import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import {
  RegisterVehicleUseCase,
  RegisterVehicleCommand,
} from '../../application/commands/register-vehicle.use-case';
import { FindVehicleByIdUseCase } from '../../application/queries/find-vehicle-by-id.use-case';
import { RegisterVehicleRequest } from '../../dto/request/register-vehicle.request';
import {
  RegisterVehicleResponse,
  VehicleResponse,
} from '../../dto/response/vehicle.response';

/**
 * VehicleController
 *
 * HTTP Presentation Layer
 * Responsibilities:
 * - Accept HTTP requests
 * - Convert HTTP ↔ DTO
 * - Call use cases
 * - Return HTTP responses
 *
 * NO business logic here!
 */
@Controller('vehicles')
export class VehicleController {
  constructor(
    private registerVehicleUseCase: RegisterVehicleUseCase,
    private findVehicleByIdUseCase: FindVehicleByIdUseCase,
  ) {}

  /**
   * POST /vehicles
   * Register a new vehicle
   */
  @Post()
  async register(
    @Body() request: RegisterVehicleRequest,
  ): Promise<RegisterVehicleResponse> {
    const command = new RegisterVehicleCommand(
      request.plate,
      request.category,
      request.ownerId,
      request.nickname,
      request.brand,
      request.model,
      request.color,
    );

    const vehicleId = await this.registerVehicleUseCase.execute(command);

    return new RegisterVehicleResponse(vehicleId);
  }

  /**
   * GET /vehicles/:id
   * Get vehicle by ID
   */
  @Get(':id')
  async getById(@Param('id') id: string): Promise<VehicleResponse> {
    const vehicle = await this.findVehicleByIdUseCase.execute(id);

    return VehicleResponse.fromEntity({
      id: vehicle.getId(),
      plate: vehicle.getPlate().toString(),
      category: vehicle.getCategory(),
      nickname: vehicle.getNickname(),
      brand: vehicle.getBrand(),
      model: vehicle.getModel(),
      color: vehicle.getColor(),
      ownerId: vehicle.getOwnerId(),
      createdAt: vehicle.getCreatedAt(),
      updatedAt: vehicle.getUpdatedAt(),
    });
  }
}
