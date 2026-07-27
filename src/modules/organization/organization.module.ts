import { Module } from '@nestjs/common';
import { CreateOrganizationUseCase } from './application/commands/create-org.usecase';
import { PrismaOrganizationRepository } from './infrastructure/repositories/prisma-organization.repository';
import { PrismaOrganizationMembership } from './infrastructure/repositories/prisma-organizationmembership.repository';
import { OrganizationController } from './presentation/controllers/organization.controller';

@Module({
  controllers: [OrganizationController],
  providers: [
    // Use Cases
    CreateOrganizationUseCase,

    // Repository Implementation
    {
      provide: 'OrganizationRepository',
      useClass: PrismaOrganizationRepository,
    },
    {
      provide: 'OrganizationMembershipRepository',
      useClass: PrismaOrganizationMembership,
    },

    // Infrastructure
  ],
  exports: ['OrganizationRepository', 'OrganizationMembershipRepository'],
})
export class OrganizationModule {}
