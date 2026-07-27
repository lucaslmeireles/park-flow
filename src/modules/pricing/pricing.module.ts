import { Module } from '@nestjs/common';
import { ParkingModule } from '../parking/parking.module';
import { PricingPeriodController } from './presentation/controllers/pricing_period.controller';
import { PricingRuleController } from './presentation/controllers/pricing_rule.controller';
import { CreatePricingRuleUseCase } from './application/commands/create_pricing_rule.usecase';
import { CreatePricingPeriodUseCase } from './application/commands/create_pricing_period.usecase';
import { PricingRuleRepositoryPrisma } from './infrastructure/repositories/pricingrule.prisma';
import { PricingPeriodPrismaRepository } from './infrastructure/repositories/pricingperiod.prisma';

@Module({
  imports: [ParkingModule],
  controllers: [PricingPeriodController, PricingRuleController],
  providers: [
    // Use Cases
    CreatePricingRuleUseCase,
    CreatePricingPeriodUseCase,

    // Repository Implementation
    {
      provide: 'PricingRuleRepository',
      useClass: PricingRuleRepositoryPrisma,
    },
    {
      provide: 'PricingPeriodRepository',
      useClass: PricingPeriodPrismaRepository,
    },

    // Infrastructure
  ],
  exports: ['PricingPeriodRepository', 'PricingRuleRepository'],
})
export class PricingModule {}
