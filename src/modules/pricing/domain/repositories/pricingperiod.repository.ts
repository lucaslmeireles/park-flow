import { PricingPeriod } from '../entities/pricingperiod';

export interface PricingPeriodRepository {
  save(pricingPeriod: PricingPeriod): Promise<void>;
  findById(id: string): Promise<PricingPeriod | null>;
}
