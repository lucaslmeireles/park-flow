import { UserRole } from 'src/generated/prisma/enums';
import { OrganizationMembership } from '../entities/organization-membership';

export interface OrganizationMembershipRepository {
  save(organization: OrganizationMembership): Promise<void>;

  findByOrgId(id: string): Promise<OrganizationMembership[]>;

  findByOrgIdAndRole(
    id: string,
    role: UserRole,
  ): Promise<OrganizationMembership[]>;

  findByUserId(id: string): Promise<OrganizationMembership>;

  delete(id: string): Promise<void>;
}
