import { ParkingSpotStatus, ParkingSpotType } from 'src/generated/prisma/enums';
import { Entity } from 'src/shared/domain/entity';

interface ParkingSpotProps {
  parkingZoneId: string;
  identifier: string;
  spotType: ParkingSpotType;
  status: ParkingSpotStatus;
  sensorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class ParkingSpot extends Entity<ParkingSpotProps> {
  private parkingZoneId;
  private identifier;
  private spotType;
  private status;
  private sensorId?;
  private deletedAt;

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

  getProps(): ParkingSpotProps {
    return {
      parkingZoneId: this.parkingZoneId,
      identifier: this.identifier,
      spotType: this.spotType,
      status: this.status,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }
}
