import { Inject, Injectable } from '@nestjs/common';
import { Weekday } from 'src/generated/prisma/enums';
import type { PricingRuleRepository } from '../../domain/repositories/princingrule.repository';
import type { PricingPeriodRepository } from '../../domain/repositories/pricingperiod.repository';
import { PricingPeriod } from '../../domain/entities/pricingperiod';
import {
  PricingRuleNotActive,
  PricingRuleNotFound,
} from '../../domain/exceptions/pricingrule.exceptions';
import { v4 as uuid } from 'uuid';

export class CreatePricingPeriodCommand {
  constructor(
    public readonly pricingRuleId: string,
    public readonly weekday: Weekday,
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly pricePerHour: number,
    public readonly pricePerDay: number,
    public readonly freeMinutes: number,
    public readonly maxDailyPrice?: number,
  ) {}
}

@Injectable()
export class CreatePricingPeriodUseCase {
  constructor(
    @Inject('PricingRuleRepository')
    private pricingRuleRepository: PricingRuleRepository,
    @Inject('PricingPeriodRepository')
    private pricingPeriodRepository: PricingPeriodRepository,
  ) {}

  async exceute(command: CreatePricingPeriodCommand): Promise<PricingPeriod> {
    const pricingRule = await this.pricingRuleRepository.findById(
      command.pricingRuleId,
    );

    if (!pricingRule) {
      throw new PricingRuleNotFound('PricingRule not found');
    }

    if (!pricingRule.getActive()) {
      throw new PricingRuleNotActive('PricingRule not active');
    }

    const id = uuid();
    const pricingPeriod = PricingPeriod.create(
      id,
      command.pricingRuleId,
      command.weekday,
      command.startTime,
      command.endTime,
      command.pricePerHour,
      command.pricePerDay,
      command.freeMinutes,
      command.maxDailyPrice,
    );

    await this.pricingPeriodRepository.save(pricingPeriod);
    return pricingPeriod;
  }
}
