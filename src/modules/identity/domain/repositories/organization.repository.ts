import { OrganizationType } from 'src/generated/prisma/enums';
import { Organization } from '../entities/organization';

export interface OrganizationRepository {
  save(organization: Organization): Promise<void>;

  findById(id: string): Promise<Organization | null>;

  findByCityId(cityId: string): Promise<Organization[]>;

  findByType(type: OrganizationType): Promise<Organization[]>;

  delete(id: string): Promise<void>;
}
