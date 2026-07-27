import { Module } from '@nestjs/common';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { PrismaModule } from './config/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { OrganizationModule } from './modules/organization/organization.module';
import { ParkingModule } from './modules/parking/parking.module';
import { IdentityModule } from './modules/identity/identity.module';
import { PricingModule } from './modules/pricing/pricing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VehicleModule,
    TicketModule,
    OrganizationModule,
    ParkingModule,
    IdentityModule,
    PricingModule,
    PrismaModule,
  ],
})
export class AppModule {}
