import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserRequestDto } from '../../dto/request/registeruser.dto';
import { RegisterUserResponse } from '../../dto/response/registeruser.dto';

import { v4 as uuid } from 'uuid';
import { RegisterUserCommand } from '../../application/commands/register-user.usecase';
@Controller('auth')
export class AuthController {
  constructor(private registerUserUseCase: ) {}
  @Post('register')
  async register(
    @Body() dto: RegisterUserRequestDto,
  ): Promise<RegisterUserResponse> {
    const id = uuid();
    const command = new RegisterUserCommand(
      id,
      dto.name,
      dto.email,
      dto.password,
    );
    await this.registerUserUseCase.execute(command);
    return new RegisterUserResponse(id);
  }
}
