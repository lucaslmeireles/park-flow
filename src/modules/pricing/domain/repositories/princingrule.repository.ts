import { PricingRule } from '../entities/princingrule';

export interface PricingRuleRepository {
  save(pricingRule: PricingRule): Promise<void>;
  findById(id: string): Promise<PricingRule | null>;
  findByName(name: string): Promise<PricingRule[] | null>;
  findByActive(active: boolean): Promise<PricingRule[] | null>;
}
