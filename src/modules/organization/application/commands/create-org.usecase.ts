import { Inject } from '@nestjs/common';
import type { OrganizationRepository } from '../../domain/repositories/organization.repository';
import { Organization } from '../../domain/entities/organization';
import { OrganizationType } from 'src/generated/prisma/enums';
import { v4 as uuid } from 'uuid';
export class CreateOrganizationCommand {
  constructor(
    public readonly name: string,
    public readonly cityId: string,
    public readonly type: OrganizationType,
    public readonly active: boolean,
    public readonly deletedAt?: Date,
  ) {}
}

export class CreateOrganizationUseCase {
  constructor(
    @Inject('OrganizationRepository')
    private organizationRepository: OrganizationRepository,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<Organization> {
    const id = uuid();
    const organization = Organization.create(
      id,
      command.name,
      command.active,
      command.type,
      command.cityId,
      { deletedAt: command.deletedAt },
    );

    await this.organizationRepository.save(organization);
    return organization;
  }
}
