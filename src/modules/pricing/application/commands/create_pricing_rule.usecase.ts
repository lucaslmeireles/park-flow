import { Inject, Injectable } from '@nestjs/common';
import { PricingStrategy, VehicleCategory } from 'src/generated/prisma/enums';
import type { PricingRuleRepository } from '../../domain/repositories/princingrule.repository';
import type { ParkingZoneRepository } from 'src/modules/parking/domain/repositories/parking_zone.repository';
import {
  ParkingZoneNotActiveException,
  ParkingZoneNotFound,
} from 'src/modules/parking/domain/exceptions/parking_zone.exceptions';
import { v4 as uuid } from 'uuid';
import { PricingRule } from '../../domain/entities/princingrule';

export class CreatePricingRuleCommand {
  constructor(
    public readonly parkingZoneId: string,
    public readonly name: string,
    public readonly effectiveFrom: Date,
    public readonly active: boolean,
    public readonly priority: number,
    public readonly strategy: PricingStrategy,
    public readonly effectiveUntil?: Date,
    public readonly vehicleCategory?: VehicleCategory,
  ) {}
}

Injectable();
export class CreatePricingRuleUseCase {
  constructor(
    @Inject('PricingRuleRepository')
    private pricingRuleRepository: PricingRuleRepository,
    @Inject('ParkingZoneRepository')
    private parkingZoneRepository: ParkingZoneRepository,
  ) {}

  async excute(command: CreatePricingRuleCommand) {
    const parkingZone = await this.parkingZoneRepository.findById(
      command.parkingZoneId,
    );

    if (!parkingZone) {
      throw new ParkingZoneNotFound(command.parkingZoneId);
    }

    if (!parkingZone?.isActive()) {
      throw new ParkingZoneNotActiveException(command.parkingZoneId);
    }

    const id = uuid();
    const pricingRule = PricingRule.create(
      id,
      command.name,
      command.parkingZoneId,
      command.priority,
      command.active,
      command.effectiveFrom,
      command.strategy,
      command.vehicleCategory,
    );

    await this.pricingRuleRepository.save(pricingRule);
    return pricingRule;
  }
}
