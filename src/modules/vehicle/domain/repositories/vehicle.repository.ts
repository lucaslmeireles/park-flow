import { Vehicle } from '../entities/vehicle';

/**
 * Vehicle Repository Interface
 *
 * Defined in the domain layer but implemented in the infrastructure layer
 * This ensures the domain does not depend on any specific technology (Prisma, MongoDB, etc.)
 */
export interface VehicleRepository {
  /**
   * Save a new vehicle or update existing one
   */
  save(vehicle: Vehicle): Promise<void>;

  /**
   * Find vehicle by ID
   */
  findById(id: string): Promise<Vehicle | null>;

  /**
   * Find vehicle by license plate
   */
  findByPlate(plate: string): Promise<Vehicle | null>;

  /**
   * Find all vehicles by owner
   */
  findByOwnerId(ownerId: string): Promise<Vehicle[]>;

  /**
   * Check if plate already exists
   */
  plateExists(plate: string): Promise<boolean>;

  /**
   * Delete a vehicle (soft delete with deletedAt)
   */
  delete(id: string): Promise<void>;
}
