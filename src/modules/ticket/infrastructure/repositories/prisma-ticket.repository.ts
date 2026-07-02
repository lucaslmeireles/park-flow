import { Injectable } from '@nestjs/common';
import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { Ticket } from '../../domain/entities/ticket';
import { PrismaService } from 'src/config/database/prisma.service';
import { TicketStatus } from '@prisma/client';

/**
 * PrismaTicketRepository
 *
 * Infrastructure implementation of TicketRepository using Prisma
 * This is where database access happens
 * The domain layer doesn't depend on this - only this depends on the domain
 */
@Injectable()
export class PrismaTicketRepository implements TicketRepository {
  constructor(private prisma: PrismaService) {}

  async save(ticket: Ticket): Promise<void> {
    const props = ticket.getProps();

    await this.prisma.ticket.upsert({
      where: { id: ticket.getId() },
      update: {
        parkingSpotId: props.parkingSpotId,
        vehicleId: props.vehicleId,
        status: props.status,
        startedAt: props.startedAt,
        endedAt: props.endedAt,
        pricingRuleId: props.pricingRuleId,
        scheduledAt: props.scheduledAt,
      },
      create: {
        id: ticket.getId(),
        parkingSpotId: props.parkingSpotId,
        vehicleId: props.vehicleId,
        status: props.status,
        startedAt: props.startedAt,
        endedAt: props.endedAt,
        pricingRuleId: props.pricingRuleId,
        scheduledAt: props.scheduledAt,
        createdAt: props.createdAt ?? new Date(),
      },
    });
  }

  async findById(id: string): Promise<Ticket | null> {
    const data = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!data) {
      return null;
    }

    return this.toDomain(data);
  }

  async findByPlate(plate: string): Promise<Ticket | null> {
    const data = await this.prisma.ticket.findFirst({
      where: { vehicle: { plate } },
    });

    if (!data) {
      return null;
    }

    return this.toDomain(data);
  }

  async vehicleHasActiveTicket(vehicleId: string): Promise<boolean> {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        vehicleId,
        endedAt: null,
        status: TicketStatus.ACTIVE,
      },
    });

    return !!ticket;
  }

  async parkingSpotHasActiveTicket(parkingSpotId: string): Promise<boolean> {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        parkingSpotId,
        endedAt: null,
        status: TicketStatus.ACTIVE,
      },
    });

    return !!ticket;
  }

  async cancelTicket(id: string): Promise<void> {
    await this.prisma.ticket.update({
      where: { id },
      data: { status: TicketStatus.CANCELLED },
    });
  }

  async finishTicket(id: string, exitTime: Date): Promise<void> {
    await this.prisma.ticket.update({
      where: { id },
      data: { endedAt: exitTime, status: TicketStatus.FINISHED },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.ticket.delete({
      where: { id },
    });
  }

  private toDomain(data: any): Ticket {
    return Ticket.reconstruct(data.id, {
      parkingSpotId: data.parkingSpotId,
      vehicleId: data.vehicleId,
      status: data.status,
      startedAt: data.startedAt,
      endedAt: data.endedAt,
      pricingRuleId: data.pricingRuleId,
      scheduledAt: data.scheduledAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
