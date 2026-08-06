import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateParkingSpotCommand,
  CreateParkingSpotUseCase,
} from '../../application/commands/create_parking_spot.usecase';
import { CreateParkingSpotRequestDto } from '../../dto/request/create_parking_spot';
import { AssignGeometryParkingSpotRequestDto } from '../../dto/request/assign_geometry';
import {
  AssignGeometryParkingSpotResponse,
  CreateParkingSpotResponse,
} from '../../dto/response/parking_spot';
import {
  AssignParkingSpotGeometryCommand,
  AssignParkingSpotGeometryUseCase,
} from '../../application/commands/assign_geometry.usecase';
import { GeoLocation } from '../../domain/value-objects/GeoLocation';

@Controller('parking-spots')
export class ParkingSpotController {
  constructor(
    private createParkingSpotUseCase: CreateParkingSpotUseCase,
    private assignGeometryUseCase: AssignParkingSpotGeometryUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateParkingSpotRequestDto,
  ): Promise<CreateParkingSpotResponse> {
    const command = new CreateParkingSpotCommand(
      dto.parkingZoneId,
      dto.identifier,
      dto.spotType,
      dto.status,
      dto.sensorId,
    );

    const result = await this.createParkingSpotUseCase.execute(command);
    return new CreateParkingSpotResponse(result.getId());
  }

  @Patch(':id/assign-geometry')
  async assignGeometry(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: AssignGeometryParkingSpotRequestDto,
  ): Promise<AssignGeometryParkingSpotResponse> {
    const command = new AssignParkingSpotGeometryCommand(id, dto.lat, dto.lng);
    await this.assignGeometryUseCase.execute(command);
    return new AssignGeometryParkingSpotResponse(
      id,
      GeoLocation.create(dto.lat, dto.lng),
    );
  }
}
