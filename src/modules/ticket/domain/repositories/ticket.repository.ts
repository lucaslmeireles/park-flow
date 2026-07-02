import { Ticket } from '../entities/ticket';

/**
 * Ticket Repository Interface
 *
 * Defined in the domain layer but implemented in the infrastructure layer
 * This ensures the domain does not depend on any specific technology (Prisma, MongoDB, etc.)
 */
export interface TicketRepository {
  /**
   * Save a new ticket or update existing one
   */
  save(ticket: Ticket): Promise<void>;

  /**
   * Find ticket by ID
   */
  findById(id: string): Promise<Ticket | null>;

  /**
   * Find ticket by vehicle plate
   */
  findByPlate(plate: string): Promise<Ticket | null>;

  /**
   * Check if vehicle has an active ticket
   */
  vehicleHasActiveTicket(vehicleId: string): Promise<boolean>;

  /**
   * Check if parking spot has an active ticket
   */
  parkingSpotHasActiveTicket(parkingSpotId: string): Promise<boolean>;

  finishTicket(id: string, exitTime: Date): Promise<void>;

  cancelTicket(id: string): Promise<void>;

  /**
   * Delete a ticket (soft delete with deletedAt)
   */
  delete(id: string): Promise<void>;
}
