/**
 * Base class for Value Objects
 * Value Objects are immutable and identified by their value, not by identity
 */
export abstract class ValueObject<T> {
  protected readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  abstract equals(vo?: ValueObject<T>): boolean;

  abstract toString(): string;
}
