import { ParkingSpotStatus, ParkingSpotType } from 'src/generated/prisma/enums';
import { Entity } from 'src/shared/domain/entity';
import { GeoLocation } from '../value-objects/GeoLocation';

interface ParkingSpotProps {
  parkingZoneId: string;
  identifier: string;
  spotType: ParkingSpotType;
  status: ParkingSpotStatus;
  geometry?: GeoLocation;
  sensorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class ParkingSpot extends Entity<ParkingSpotProps> {
  private parkingZoneId: string;
  private identifier: string;
  private spotType: ParkingSpotType;
  private status: ParkingSpotStatus;
  private deletedAt?: Date;
  private sensorId?: string;
  private geometry?: GeoLocation;

  constructor(id: string, props: ParkingSpotProps) {
    super(id, props.createdAt, props.updatedAt);
    this.parkingZoneId = props.parkingZoneId;
    this.identifier = props.identifier;
    this.spotType = props.spotType;
    this.status = props.status;
    this.sensorId = props.sensorId;
    this.deletedAt = props.deletedAt;
  }

  static create(
    id: string,
    parkingZoneId: string,
    identifier: string,
    spotType: ParkingSpotType,
    status: ParkingSpotStatus,
    props?: Partial<ParkingSpotProps>,
  ) {
    return new ParkingSpot(id, {
      parkingZoneId,
      identifier,
      spotType,
      status,
      ...props,
    });
  }

  equals(object?: Entity<ParkingSpotProps>): boolean {
    if (!object) return false;
    return this.id === object.getId();
  }

  static reconstruct(id: string, props: ParkingSpotProps): ParkingSpot {
    return new ParkingSpot(id, props);
  }

  assignGeometry(geometry: GeoLocation): void {
    this.geometry = geometry;
    this.setUpdatedAt(new Date());
  }

  getGeometry(): GeoLocation | boolean {
    return this.geometry ?? false;
  }

  updateDetails(details: Partial<ParkingSpotProps>): void {
    if (details.identifier) {
      this.identifier = details.identifier;
    }
    if (details.status) {
      this.status = details.status;
    }
    if (details.spotType) {
      this.spotType = details.spotType;
    }
    if (details.status) {
      this.status = details.status;
    }
    if (details.sensorId) {
      this.sensorId = details.sensorId;
    }

    this.setUpdatedAt(new Date());
  }

  getProps(): ParkingSpotProps {
    return {
      parkingZoneId: this.parkingZoneId,
      identifier: this.identifier,
      spotType: this.spotType,
      status: this.status,
      geometry: this.geometry,
      sensorId: this.sensorId,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }
}
