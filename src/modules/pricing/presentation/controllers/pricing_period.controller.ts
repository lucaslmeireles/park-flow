import { Body, Controller, Post } from '@nestjs/common';
import {
  CreatePricingPeriodCommand,
  CreatePricingPeriodUseCase,
} from '../../application/commands/create_pricing_period.usecase';
import { CreatePricingPeriodRequestDto } from '../../dto/request/create_pricing_period';
import { CreatePricingPeriodResponse } from '../../dto/response/pricing_period';

@Controller('pricing-periods')
export class PricingPeriodController {
  constructor(
    private createPrincingPeriodUseCase: CreatePricingPeriodUseCase,
  ) {}

  @Post('')
  async create(@Body() dto: CreatePricingPeriodRequestDto): Promise<any> {
    const command = new CreatePricingPeriodCommand(
      dto.pricingRuleId,
      dto.weekday,
      dto.startTime,
      dto.endTime,
      dto.pricePerHour,
      dto.pricePerDay,
      dto.freeMinutes,
      dto.maxDailyPrice,
    );

    const result = await this.createPrincingPeriodUseCase.exceute(command);
    return new CreatePricingPeriodResponse(result.getId());
  }
}
