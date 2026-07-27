import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { Weekday } from 'src/generated/prisma/enums';

export class CreatePricingPeriodRequestDto {
  @IsUUID()
  pricingRuleId: string;

  @IsEnum(Weekday)
  weekday: Weekday;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endTime: Date;

  @IsNumber()
  @IsPositive()
  pricePerHour: number;

  @IsNumber()
  @IsPositive()
  pricePerDay: number;

  @IsNumber()
  @IsPositive()
  freeMinutes: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxDailyPrice: number;
}
