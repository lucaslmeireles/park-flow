import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateOrganizationCommand,
  CreateOrganizationUseCase,
} from '../../application/commands/create-org.usecase';
import { CreateOrganizationRequestDto } from '../../dto/request/create_organization.dto';
import { CreateOrganizationResponse } from '../../dto/response/organization';

@Controller('organizations')
export class OrganizationController {
  constructor(private createOrganizationUseCase: CreateOrganizationUseCase) {}

  @Post('')
  async create(@Body() dto: CreateOrganizationRequestDto) {
    const command = new CreateOrganizationCommand(
      dto.name,
      dto.type,
      dto.active,
    );
    const data = await this.createOrganizationUseCase.execute(command);
    return new CreateOrganizationResponse(data.getId());
  }
}
