import { Injectable } from '@nestjs/common';
import { PricingRule } from '../../domain/entities/princingrule';
import { PricingRuleRepository } from '../../domain/repositories/princingrule.repository';
import { PrismaService } from 'src/config/database/prisma.service';

@Injectable()
export class PricingRuleRepositoryPrisma implements PricingRuleRepository {
  constructor(private prisma: PrismaService) {}
  async save(pricingRule: PricingRule): Promise<void> {
    const props = pricingRule.getProps();
    await this.prisma.pricingRule.upsert({
      where: {
        id: pricingRule.getId(),
      },
      update: {
        deletedAt: props.deletedAt,
        active: props.active,
        effectiveFrom: props.effectiveFrom,
        effectiveUntil: props.effectiveUntil,
        parkingZoneId: props.parkingZoneId,
        name: props.name,
        priority: props.priority,
        strategy: props.strategy,
        vehicleCategory: props.vehicleCategory,
      },
      create: {
        id: pricingRule.getId(),
        priority: props.priority,
        strategy: props.strategy,
        vehicleCategory: props.vehicleCategory,
        active: props.active,
        effectiveFrom: props.effectiveFrom,
        effectiveUntil: props.effectiveUntil,
        parkingZoneId: props.parkingZoneId,
        name: props.name,
      },
    });
  }
  async findById(id: string): Promise<PricingRule | null> {
    const data = await this.prisma.pricingRule.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!data || data === null) {
      return null;
    }

    return this.toDomain(data);
  }
  async findByName(name: string): Promise<PricingRule[] | null> {
    const data = await this.prisma.pricingRule.findMany({
      where: {
        name,
      },
    });

    if (!data || data === null) {
      return null;
    }

    return data.map((pricingRule) => this.toDomain(pricingRule));
  }

  async findByActive(active: boolean): Promise<PricingRule[] | null> {
    const data = await this.prisma.pricingRule.findMany({
      where: {
        active,
      },
    });

    if (!data || data === null) {
      return null;
    }

    return data.map((pricingRule) => this.toDomain(pricingRule));
  }

  private toDomain(data: any): PricingRule {
    return PricingRule.reconstruct(data.id, {
      priority: data.priority,
      strategy: data.strategy,
      vehicleCategory: data.vehicleCategory,
      active: data.active,
      effectiveFrom: data.effectiveFrom,
      effectiveUntil: data.effectiveUntil,
      parkingZoneId: data.parkingZoneId,
      name: data.name,
      createdAt: data.createdAt,
      deletedAt: data.deletedAt,
      updatedAt: data.updatedAt,
    });
  }
}
