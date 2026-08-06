import { IsNumber } from 'class-validator';

export class AssignGeometryParkingSpotRequestDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}
