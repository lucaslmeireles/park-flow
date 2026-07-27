import { Weekday } from 'src/generated/prisma/enums';
import { Entity } from 'src/shared/domain/entity';

export interface PricingPeriodProps {
  pricingRuleId: string;
  weekday: Weekday;
  startTime: Date;
  endTime: Date;
  pricePerHour: number;
  pricePerDay: number;
  maxDailyPrice?: number;
  freeMinutes: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class PricingPeriod extends Entity<PricingPeriodProps> {
  private pricingRuleId;
  private weekday;
  private startTime;
  private endTime;
  private pricePerHour;
  private pricePerDay;
  private maxDailyPrice?;
  private freeMinutes;
  private deletedAt?;

  constructor(id: string, props: PricingPeriodProps) {
    super(id, props.createdAt, props.updatedAt);
    this.pricingRuleId = props.pricingRuleId;
    this.weekday = props.weekday;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.pricePerHour = props.pricePerHour;
    this.pricePerDay = props.pricePerDay;
    this.maxDailyPrice = props.maxDailyPrice;
    this.freeMinutes = props.freeMinutes;
    this.deletedAt = props.deletedAt;
  }
  static create(
    id: string,
    pricingRuleId: string,
    weekday: Weekday,
    startTime: Date,
    endTime: Date,
    pricePerHour: number,
    pricePerDay: number,
    freeMinutes: number,
    maxDailyPrice?: number,
    props?: Partial<PricingPeriodProps>,
  ) {
    return new PricingPeriod(id, {
      pricingRuleId,
      weekday,
      startTime,
      endTime,
      pricePerHour,
      pricePerDay,
      freeMinutes,
      maxDailyPrice,
      ...props,
    });
  }

  equals(object?: Entity<PricingPeriodProps>): boolean {
    if (!object) return false;
    return this.id === object.getId();
  }

  static reconstruct(id: string, props: PricingPeriodProps) {
    return new PricingPeriod(id, props);
  }

  getProps(): PricingPeriodProps {
    return {
      pricingRuleId: this.pricingRuleId,
      weekday: this.weekday,
      startTime: this.startTime,
      endTime: this.endTime,
      pricePerHour: this.pricePerHour,
      pricePerDay: this.pricePerDay,
      maxDailyPrice: this.maxDailyPrice,
      freeMinutes: this.freeMinutes,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
      deletedAt: this.deletedAt,
    };
  }
}
