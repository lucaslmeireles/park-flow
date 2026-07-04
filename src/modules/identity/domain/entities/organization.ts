import { OrganizationType } from 'src/generated/prisma/enums';
import { Entity } from 'src/shared/domain/entity';

interface OrganizationProps {
  name: string;
  cityId: string;
  type: OrganizationType;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Organization extends Entity<OrganizationProps> {
  private name;
  private cityId;
  private type;
  private active;
  private deletedAt?: Date;
  constructor(id: string, props: OrganizationProps) {
    super(id, props.createdAt, props.updatedAt);
    this.name = props.name;
    this.cityId = props.cityId;
    this.type = props.type;
    this.active = props.active;
    this.deletedAt = props.deletedAt;
  }

  static create(
    id: string,
    name: string,
    active: boolean,
    type: OrganizationType,
    cityId: string,
    props?: Partial<OrganizationProps>,
  ): Organization {
    return new Organization(id, {
      name,
      active,
      type,
      cityId,
      ...props,
    });
  }

  static reconstruct(id: string, props: OrganizationProps): Organization {
    return new Organization(id, props);
  }

  equals(other?: Entity<OrganizationProps>): boolean {
    if (!other) return false;
    return this.id === other.getId();
  }

  /**
   * Get all properties for persistence
   */
  getProps(): OrganizationProps {
    return {
      name: this.name,
      cityId: this.cityId,
      type: this.type,
      active: this.active,
      deletedAt: this.deletedAt,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }
}
