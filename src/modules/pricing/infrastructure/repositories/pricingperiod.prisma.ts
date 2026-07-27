import { Injectable } from '@nestjs/common';
import { PricingPeriodRepository } from '../../domain/repositories/pricingperiod.repository';
import { PrismaService } from 'src/config/database/prisma.service';
import { PricingPeriod } from '../../domain/entities/pricingperiod';

@Injectable()
export class PricingPeriodPrismaRepository implements PricingPeriodRepository {
  constructor(private prisma: PrismaService) {}

  async save(pricingPeriod: PricingPeriod): Promise<void> {
    const props = pricingPeriod.getProps();
    await this.prisma.pricingPeriod.upsert({
      where: {
        id: pricingPeriod.getId(),
      },
      update: {
        deletedAt: props.deletedAt,
        endTime: props.endTime,
        freeMinutes: props.freeMinutes,
        maxDailyPrice: props.maxDailyPrice,
        pricePerDay: props.pricePerDay,
        pricePerHour: props.pricePerHour,
        startTime: props.startTime,
        weekday: props.weekday,
      },

      create: {
        id: pricingPeriod.getId(),
        endTime: props.endTime,
        freeMinutes: props.freeMinutes,
        maxDailyPrice: props.maxDailyPrice,
        pricePerDay: props.pricePerDay,
        pricePerHour: props.pricePerHour,
        startTime: props.startTime,
        weekday: props.weekday,
        pricingRuleId: props.pricingRuleId,
      },
    });
  }

  async findById(id: string): Promise<PricingPeriod | null> {
    const data = await this.prisma.pricingPeriod.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!data || data == null) {
      return null;
    }

    return this.toDomain(data);
  }

  private toDomain(data: any): PricingPeriod {
    return PricingPeriod.reconstruct(data.id, { ...data });
  }
}
