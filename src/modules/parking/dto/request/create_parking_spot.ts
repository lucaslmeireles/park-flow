import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import {
  OperationMode,
  ParkingSpotStatus,
  ParkingSpotType,
} from 'src/generated/prisma/enums';

export class CreateParkingSpotRequestDto {
  @IsUUID()
  @IsString()
  parkingZoneId!: string;

  @IsString()
  identifier!: string;

  @IsEnum(ParkingSpotType)
  spotType!: ParkingSpotType;

  @IsEnum(ParkingSpotStatus)
  status!: ParkingSpotStatus;

  @IsOptional()
  @IsUUID()
  sensorId?: string;
}
