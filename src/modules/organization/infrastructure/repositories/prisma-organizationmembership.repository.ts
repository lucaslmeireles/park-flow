import { Injectable } from '@nestjs/common';
import { OrganizationMembershipRepository } from '../../domain/repositories/organization-membership.repository';
import { OrganizationMembership } from '../../domain/entities/organization-membership';
import { PrismaService } from 'src/config/database/prisma.service';
import { UserRole } from 'src/generated/prisma/enums';

@Injectable()
export class PrismaOrganizationMembership implements OrganizationMembershipRepository {
  constructor(private prisma: PrismaService) {}
  async save(organization: OrganizationMembership): Promise<void> {
    const props = organization.getProps();
    await this.prisma.organizationMembership.upsert({
      where: {
        id: organization.getId(),
      },
      update: {
        role: props.role,
        deletedAt: props.deletedAt,
        updatedAt: props.updatedAt,
      },
      create: {
        role: props.role,
        userId: props.userId,
        organizationId: props.organizationId,

        createdAt: props.createdAt,
      },
    });
  }

  async findByOrgId(id: string): Promise<OrganizationMembership[]> {
    const data = await this.prisma.organizationMembership.findMany({
      where: {
        organizationId: id,
      },
    });

    return data.map((org) => this.toDomain(org));
  }

  async findByOrgIdAndRole(
    id: string,
    role: UserRole,
  ): Promise<OrganizationMembership[]> {
    const data = await this.prisma.organizationMembership.findMany({
      where: {
        organizationId: id,
        role: role,
      },
    });

    return data.map((org) => this.toDomain(org));
  }

  async findByUserId(id: string): Promise<OrganizationMembership | null> {
    const data = await this.prisma.organizationMembership.findFirst({
      where: {
        userId: id,
      },
    });

    return data ? this.toDomain(data) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.organizationMembership.delete({
      where: {
        id: id,
      },
    });
  }
  private toDomain(data: any): OrganizationMembership {
    return OrganizationMembership.reconstruct(data.id, {
      organizationId: data.organizationId,
      role: data.role,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }
}
