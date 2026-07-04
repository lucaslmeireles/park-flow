import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { PrismaService } from 'src/config/database/prisma.service';
import { Organization } from '../../domain/entities/organization';
import { OrganizationType } from 'src/generated/prisma/enums';

@Injectable()
export class PrismaOrganizationRepository implements OrganizationRepository {
  constructor(private prisma: PrismaService) {}

  async save(organization: Organization): Promise<void> {
    const props = organization.getProps();
    await this.prisma.organization.upsert({
      where: { id: organization.getId() },
      update: {
        name: props.name,
        active: props.active,
        type: props.type,
        updatedAt: new Date(),
      },
      create: {
        id: organization.getId(),
        name: props.name,
        active: props.active,
        type: props.type,
        createdAt: new Date(),
        cityId: props.cityId,
      },
    });
  }

  async findById(id: string): Promise<Organization | null> {
    const data = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!data || data.deletedAt) {
      return null;
    }

    return this.toDomain(data);
  }

  async findByCityId(cityId: string): Promise<Organization[]> {
    const data = await this.prisma.organization.findMany({
      where: { cityId, deletedAt: null },
    });

    return data.map((org) => this.toDomain(org));
  }

  async findByType(type: OrganizationType): Promise<Organization[]> {
    const data = await this.prisma.organization.findMany({
      where: { type, deletedAt: null },
    });
    return data.map((org) => this.toDomain(org));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.organization.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private toDomain(data: any): Organization {
    return Organization.reconstruct(data.id, {
      name: data.name,
      cityId: data.cityId,
      type: data.type,
      active: data.active,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }
}
