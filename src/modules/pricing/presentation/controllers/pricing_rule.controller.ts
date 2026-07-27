import { Body, Controller, Post } from '@nestjs/common';
import {
  CreatePricingRuleCommand,
  CreatePricingRuleUseCase,
} from '../../application/commands/create_pricing_rule.usecase';
import { CreatePricingRuleRquestDto } from '../../dto/request/create_pricing_rule';
import { CreatePricingRuleResponse } from '../../dto/response/pricing_rule';

@Controller('pricing-rules')
export class PricingRuleController {
  constructor(private createPricingRuleUseCase: CreatePricingRuleUseCase) {}

  @Post()
  async create(
    @Body() dto: CreatePricingRuleRquestDto,
  ): Promise<CreatePricingRuleResponse> {
    const command = new CreatePricingRuleCommand(
      dto.parkingZoneId,
      dto.name,
      dto.effectiveFrom,
      dto.active,
      dto.priority,
      dto.strategy,
      dto.effectiveUntil,
      dto.vehicleCategory,
    );

    const result = await this.createPricingRuleUseCase.excute(command);
    return new CreatePricingRuleResponse(result.getId());
  }
}
