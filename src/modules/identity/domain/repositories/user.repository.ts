import { User } from '../entities/user';

/**
 * Vehicle Repository Interface
 *
 * Defined in the domain layer but implemented in the infrastructure layer
 * This ensures the domain does not depend on any specific technology (Prisma, MongoDB, etc.)
 */
export interface UserRepository {
  /**
   * Save a new user or update existing one
   */
  save(user: User): Promise<void>;

  /**
   * Find vehicle by ID
   */
  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  /**
   * Delete a vehicle (soft delete with deletedAt)
   */
  delete(id: string): Promise<void>;
}
