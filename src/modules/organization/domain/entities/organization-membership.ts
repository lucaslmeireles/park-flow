import { UserRole } from 'src/generated/prisma/enums';
import { Entity } from 'src/shared/domain/entity';

interface OrganizationMembershipProps {
  organizationId: string;
  userId: string;
  role: UserRole;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class OrganizationMembership extends Entity<OrganizationMembershipProps> {
  private organizationId: string;
  private userId: string;
  private role: UserRole;
  private deletedAt?: Date;

  private constructor(id: string, props: OrganizationMembershipProps) {
    super(id, props.createdAt, props.updatedAt);
    this.organizationId = props.organizationId;
    this.userId = props.userId;
    this.role = props.role;
    this.deletedAt = props.deletedAt;
  }

  static create(
    id: string,
    organizationId: string,
    userId: string,
    role: UserRole,
    props?: Partial<OrganizationMembershipProps>,
  ): OrganizationMembership {
    return new OrganizationMembership(id, {
      organizationId,
      userId,
      role,
      ...props,
    });
  }

  static reconstruct(id: string, props: OrganizationMembershipProps) {
    return new OrganizationMembership(id, props);
  }

  changeRole(newRole: UserRole) {
    if (this.role === newRole) return;
    this.role = newRole;
    this.setUpdatedAt(new Date());
  }

  deactivate(deletedAt: Date = new Date()) {
    this.deletedAt = deletedAt;
    this.setUpdatedAt(new Date());
  }

  getProps(): OrganizationMembershipProps {
    return {
      organizationId: this.organizationId,
      userId: this.userId,
      role: this.role,
      deletedAt: this.deletedAt,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }

  equals(other?: Entity<OrganizationMembershipProps>): boolean {
    if (!other) return false;
    return this.getId() === other.getId();
  }
}
