import { ValueObject } from 'src/shared/domain/value-object';

/**
 * LicensePlate Value Object
 *
 * BR-009: Vehicle plate is mandatory
 * BR-010: Vehicle plate must be unique
 *
 * Represents an immutable license plate with business rules
 */
export class LicensePlate extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  /**
   * Creates a LicensePlate instance with validation
   * Format: ABC-1234 (3 letters, hyphen, 4 digits)
   */
  static create(plate: string): LicensePlate {
    const sanitized = plate.toUpperCase().trim();

    // Validate format: ABC-1234
    const isValid = /^[A-Z]{3}-\d{4}$/.test(sanitized);

    if (!isValid) {
      throw new Error('Invalid license plate format. Expected: ABC-1234');
    }

    return new LicensePlate(sanitized);
  }

  equals(vo?: ValueObject<string>): boolean {
    if (!vo) return false;
    return vo.getValue() === this.value;
  }

  toString(): string {
    return this.value;
  }
}
