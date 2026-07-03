import { Module } from '@nestjs/common';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { PrismaModule } from './config/database/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VehicleModule,
    TicketModule,
    PrismaModule,
  ],
})
export class AppModule {}
