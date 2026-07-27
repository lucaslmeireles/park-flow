import { ParkingSpotStatus } from 'src/generated/prisma/enums';
import { ParkingSpot } from '../entities/parking_spot';

export interface ParkingSpotRepository {
  save(parking_zone: ParkingSpot): Promise<void>;
  findById(id: string): Promise<ParkingSpot | null>;
  findByParkingZoneId(id: string): Promise<ParkingSpot[] | null>;
  assignGeometry(id: string, geometry: string): Promise<void>;
  findByStatus(status: ParkingSpotStatus): Promise<ParkingSpot[] | null>;
}
