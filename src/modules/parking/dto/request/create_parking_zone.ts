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
import { OperationMode } from 'src/generated/prisma/enums';

export class CreateParkingZoneRequestDto {
  @IsUUID()
  @IsString()
  organizationId!: string;

  @IsBoolean()
  active!: boolean;

  @IsString()
  @MinLength(3)
  displayName!: string;

  @IsString()
  @MinLength(3)
  displayAddress!: string;

  @IsEnum(OperationMode)
  operationMode!: OperationMode;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  capacity?: number;
}
