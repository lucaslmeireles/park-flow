import { PricingStrategy, VehicleCategory } from 'src/generated/prisma/enums';
import { Entity } from 'src/shared/domain/entity';

export interface PricingRuleProps {
  parkingZoneId: string;
  vehicleCategory?: VehicleCategory;
  name: string;
  priority: number;
  strategy: PricingStrategy;
  active: boolean;
  effectiveFrom: Date;
  effectiveUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class PricingRule extends Entity<PricingRuleProps> {
  private parkingZoneId;
  private name;
  private priority;
  private strategy;
  private active;
  private effectiveFrom;
  private vehicleCategory?;
  private effectiveUntil?;
  private deletedAt?;

  constructor(id: string, props: PricingRuleProps) {
    super(id, props.createdAt, props.updatedAt);
    this.active = props.active;
    this.parkingZoneId = props.parkingZoneId;
    this.vehicleCategory = props.vehicleCategory;
    this.priority = props.priority;
    this.strategy = props.strategy;
    this.name = props.name;
    this.effectiveFrom = props.effectiveFrom;
    this.effectiveUntil = props.effectiveUntil;
    this.deletedAt = props.deletedAt;
  }

  static create(
    id: string,
    name: string,
    parkingZoneId: string,
    priority: number,
    active: boolean,
    effectiveFrom: Date,
    strategy: PricingStrategy,
    vehicleCategory?: VehicleCategory,
    props?: Partial<PricingRuleProps>,
  ) {
    return new PricingRule(id, {
      name,
      parkingZoneId,
      priority,
      active,
      vehicleCategory,
      effectiveFrom,
      strategy,
      ...props,
    });
  }

  equals(object?: Entity<PricingRuleProps>): boolean {
    if (!object) return false;
    return this.id === object.getId();
  }

  static reconstruct(id: string, props: PricingRuleProps) {
    return new PricingRule(id, props);
  }

  getActive(): boolean {
    return this.active;
  }

  getProps(): PricingRuleProps {
    return {
      active: this.active,
      name: this.name,
      effectiveFrom: this.effectiveFrom,
      effectiveUntil: this.effectiveUntil,
      parkingZoneId: this.parkingZoneId,
      priority: this.priority,
      strategy: this.strategy,
      vehicleCategory: this.vehicleCategory,
      createdAt: this.getCreatedAt(),
      deletedAt: this.deletedAt,
      updatedAt: this.getUpdatedAt(),
    };
  }
}
