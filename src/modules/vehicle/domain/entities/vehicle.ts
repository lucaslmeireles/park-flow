import { Entity } from '@/shared/domain/entity';
import { LicensePlate } from '../value-objects/license-plate';
import { VehicleCategory } from '@prisma/client';

interface VehicleProps {
  plate: LicensePlate;
  category: VehicleCategory;
  ownerId?: string;
  nickname?: string;
  brand?: string;
  model?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Vehicle Aggregate Root
 *
 * Represents a vehicle in the parking system
 * - Every vehicle must have a valid license plate (BR-009, BR-010)
 * - Vehicle owns all its business logic and validation
 */
export class Vehicle extends Entity<VehicleProps> {
  private plate: LicensePlate;
  private category: VehicleCategory;
  private ownerId?: string;
  private nickname?: string;
  private brand?: string;
  private model?: string;
  private color?: string;

  private constructor(id: string, props: VehicleProps) {
    super(id, props.createdAt, props.updatedAt);
    this.plate = props.plate;
    this.category = props.category;
    this.ownerId = props.ownerId;
    this.nickname = props.nickname;
    this.brand = props.brand;
    this.model = props.model;
    this.color = props.color;
  }

  /**
   * Create a new Vehicle
   * Factory method that enforces all business rules at creation time
   */
  static create(
    id: string,
    plate: LicensePlate,
    category: VehicleCategory,
    props?: Partial<VehicleProps>,
  ): Vehicle {
    return new Vehicle(id, {
      plate,
      category,
      ...props,
    });
  }

  /**
   * Reconstruct a Vehicle from database (used by repository)
   */
  static reconstruct(id: string, props: VehicleProps): Vehicle {
    return new Vehicle(id, props);
  }

  // ===== Getters (immutable access to properties) =====

  getPlate(): LicensePlate {
    return this.plate;
  }

  getCategory(): VehicleCategory {
    return this.category;
  }

  getOwnerId(): string | undefined {
    return this.ownerId;
  }

  getNickname(): string | undefined {
    return this.nickname;
  }

  getBrand(): string | undefined {
    return this.brand;
  }

  getModel(): string | undefined {
    return this.model;
  }

  getColor(): string | undefined {
    return this.color;
  }

  // ===== Business Logic =====

  /**
   * Update vehicle details (brand, model, color, nickname)
   * The plate cannot be changed after creation (business rule)
   */
  updateDetails(details: {
    brand?: string;
    model?: string;
    color?: string;
    nickname?: string;
  }): void {
    if (details.brand) this.brand = details.brand;
    if (details.model) this.model = details.model;
    if (details.color) this.color = details.color;
    if (details.nickname) this.nickname = details.nickname;
    this.setUpdatedAt(new Date());
  }

  /**
   * Assign the vehicle to an owner
   */
  assignToOwner(ownerId: string): void {
    this.ownerId = ownerId;
    this.setUpdatedAt(new Date());
  }

  // ===== Entity Contract =====

  equals(other?: Entity<VehicleProps>): boolean {
    if (!other) return false;
    return this.id === other.getId();
  }

  /**
   * Get all properties for persistence
   */
  getProps(): VehicleProps {
    return {
      plate: this.plate,
      category: this.category,
      ownerId: this.ownerId,
      nickname: this.nickname,
      brand: this.brand,
      model: this.model,
      color: this.color,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }
}
