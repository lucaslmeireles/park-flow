import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateParkingSpotCommand,
  CreateParkingSpotUseCase,
} from '../../application/commands/create_parking_spot.usecase';
import { CreateParkingSpotRequestDto } from '../../dto/request/create_parking_spot';
import { CreateParkingSpotResponse } from '../../dto/response/parking_spot';

@Controller('parking-spots')
export class ParkingSpotController {
  constructor(private createParkingSpotUseCase: CreateParkingSpotUseCase) {}

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
}
