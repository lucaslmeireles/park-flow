import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { PricingStrategy, VehicleCategory } from 'src/generated/prisma/enums';

export class CreatePricingRuleRquestDto {
  @IsUUID()
  parkingZoneId: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsNumber()
  @IsPositive()
  priority: number;

  @IsBoolean()
  active: boolean;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  effectiveFrom: Date;

  @IsDate()
  @IsOptional()
  effectiveUntil?: Date;

  @IsEnum(PricingStrategy)
  strategy: PricingStrategy;

  @IsEnum(VehicleCategory)
  vehicleCategory: VehicleCategory;
}
