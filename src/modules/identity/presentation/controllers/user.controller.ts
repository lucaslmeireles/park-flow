import { Body, Controller, Param, Patch } from '@nestjs/common';
import {
  UpdateNameCommand,
  UpdateNameUseCase,
} from '../../application/commands/update-user-name.usecase';
import {
  UpdatePasswordCommand,
  UpdatePasswordUseCase,
} from '../../application/commands/update-user-password.usecase';
import { UpdateNameRequestDto } from '../../dto/request/updatename.dto';
import {
  UpdateNameUserResponse,
  UpdatePasswordUserResponse,
} from '../../dto/response/user.dto';
import { UpdatePasswordRequestDto } from '../../dto/request/updatepassword.dto';

@Controller('users')
export class UserController {
  constructor(
    private updateNameUseCase: UpdateNameUseCase,
    private updatePasswordUseCase: UpdatePasswordUseCase,
  ) {}

  @Patch(':id/update-name')
  async updateName(
    @Param('id') id: string,
    @Body() dto: UpdateNameRequestDto,
  ): Promise<UpdateNameUserResponse> {
    const command = new UpdateNameCommand(id, dto.name);
    await this.updateNameUseCase.excute(command);
    return new UpdateNameUserResponse();
  }

  @Patch(':id/update-password')
  async updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordRequestDto,
  ): Promise<UpdatePasswordUserResponse> {
    const command = new UpdatePasswordCommand(
      id,
      dto.password,
      dto.newPassword,
    );
    await this.updatePasswordUseCase.execute(command);
    return new UpdatePasswordUserResponse();
  }
}
