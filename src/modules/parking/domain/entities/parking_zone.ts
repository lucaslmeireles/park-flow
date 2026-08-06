import { OperationMode } from 'src/generated/prisma/enums';
import { Entity } from 'src/shared/domain/entity';
import { GeoLocation } from '../value-objects/GeoLocation';

interface ParkingZoneProps {
  organizationId: string;
  displayName: string;
  displayAddress: string;
  geometry?: GeoLocation;
  operationMode: OperationMode;
  active: boolean;
  capacity?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class ParkingZone extends Entity<ParkingZoneProps> {
  private organizationId: string;
  private displayName: string;
  private displayAddress: string;
  private operationMode: OperationMode;
  private active: boolean;
  private geometry?: GeoLocation;
  private capacity?: number;
  private deletedAt?: Date;
  constructor(id: string, props: ParkingZoneProps) {
    super(id, props.createdAt, props.updatedAt);
    this.active = props.active;
    this.displayName = props.displayName;
    this.displayAddress = props.displayAddress;
    this.organizationId = props.organizationId;
    this.operationMode = props.operationMode;
    this.deletedAt = props.deletedAt;
    this.capacity = props.capacity;
  }

  static create(
    id: string,
    active: boolean,
    capacity: number,
    displayName: string,
    displayAddress: string,
    organizationId: string,
    operationMode: OperationMode,
    props?: Partial<ParkingZoneProps>,
  ) {
    return new ParkingZone(id, {
      active,
      capacity,
      displayAddress,
      displayName,
      organizationId,
      operationMode,
      ...props,
    });
  }
  equals(object?: Entity<ParkingZoneProps>): boolean {
    if (!object) return false;
    return this.id === object.getId();
  }

  static reconstruct(id: string, props: ParkingZoneProps): ParkingZone {
    return new ParkingZone(id, props);
  }

  getProps(): ParkingZoneProps {
    return {
      active: this.active,
      displayAddress: this.displayAddress,
      displayName: this.displayName,
      capacity: this.capacity,
      operationMode: this.operationMode,
      organizationId: this.organizationId,
      geometry: this.geometry,
      deletedAt: this.deletedAt,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }

  isActive(): boolean {
    return this.active && !this.deletedAt;
  }
}
