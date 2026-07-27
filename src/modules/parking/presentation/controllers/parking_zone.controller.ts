import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateParkingZoneCommand,
  CreateParkingZoneUseCase,
} from '../../application/commands/create_parking_zone.usecase';
import { CreateParkingZoneRequestDto } from '../../dto/request/create_parking_zone';
import { CreateParkingZoneResponse } from '../../dto/response/parking_zone';

@Controller('parking-zones')
export class ParkingZoneController {
  constructor(private createParkingZoneUseCase: CreateParkingZoneUseCase) {}

  @Post('')
  async create(
    @Body() dto: CreateParkingZoneRequestDto,
  ): Promise<CreateParkingZoneResponse> {
    const command = new CreateParkingZoneCommand(
      dto.organizationId,
      dto.active,
      dto.displayAddress,
      dto.displayName,
      dto.operationMode,
      dto.capacity,
    );
    const result = await this.createParkingZoneUseCase.execute(command);
    return new CreateParkingZoneResponse(result.getId());
  }
}
