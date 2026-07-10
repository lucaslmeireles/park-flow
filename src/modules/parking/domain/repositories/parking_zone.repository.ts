import { OperationMode } from 'src/generated/prisma/enums';
import { ParkingZone } from '../entities/parking_zone';

export interface ParkingZoneRepository {
  save(parking_zone: ParkingZone): Promise<void>;
  findById(id: string): Promise<ParkingZone | null>;
  assignGeometry(id: string, geometry: string): Promise<void>;
  findByOperationMode(mode: OperationMode): Promise<ParkingZone[] | null>;
  findByOrgId(org_id: string): Promise<ParkingZone[] | null>;
  findByActive(active: boolean): Promise<ParkingZone[] | null>;
}
