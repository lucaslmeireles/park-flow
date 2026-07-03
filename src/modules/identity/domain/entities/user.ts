import { Entity } from 'src/shared/domain/entity';

interface UserProps {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

/**
 * User Aggregate Root
 *
 * Represents a User in the parking system
 */
export class User extends Entity<UserProps> {
  private name: string;
  private email: string;
  private password: string;
  private deletedAt?: Date;
  private constructor(id: string, props: UserProps) {
    super(id, props.createdAt, props.updatedAt);
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.deletedAt = props.deletedAt;
  }

  /**
   * Create a new User
   * Factory method that enforces all business rules at creation time
   */
  static create(
    id: string,
    name: string,
    email: string,
    password: string,
    props?: Partial<UserProps>,
  ): User {
    return new User(id, {
      name,
      email,
      password,
      ...props,
    });
  }

  /**
   * Reconstruct a user from database (used by repository)
   */
  static reconstruct(id: string, props: UserProps): User {
    return new User(id, props);
  }

  // ===== Getters (immutable access to properties) =====
  getName(): string {
    return this.name;
  }
  getEmail(): string {
    return this.email;
  }
  // ===== Business Logic =====

  /**
   * Update user details
   */
  updateDetails(details: { name?: string; password?: string }): void {
    if (details.name) this.name = details.name;
    if (details.password) this.password = details.password;
    this.setUpdatedAt(new Date());
  }

  // ===== Entity Contract =====

  equals(other?: Entity<UserProps>): boolean {
    if (!other) return false;
    return this.id === other.getId();
  }

  /**
   * Get all properties for persistence
   */
  getProps(): UserProps {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      deletedAt: this.deletedAt,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }
}
