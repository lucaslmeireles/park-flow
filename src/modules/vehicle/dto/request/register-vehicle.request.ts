import { VehicleCategory } from '@prisma/client';
import { IsString, IsEnum, IsOptional } from 'class-validator';

/**
 * RegisterVehicleRequest DTO
 * HTTP Request contract for registering a new vehicle
 * DTOs are responsible for input validation through decorators
 */
export class RegisterVehicleRequest {
  @IsString()
  plate: string;

  @IsEnum(VehicleCategory)
  category: VehicleCategory;

  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  color?: string;
}
