/**
 * Base class for all domain entities
 * Every entity has an ID and timestamps
 */
export abstract class Entity<T> {
  protected readonly id: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(id: string, createdAt?: Date, updatedAt?: Date) {
    this.id = id;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setUpdatedAt(date: Date): void {
    this.updatedAt = date;
  }

  abstract equals(object?: Entity<T>): boolean;
}
