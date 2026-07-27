import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserRequestDto } from '../../dto/request/registeruser.dto';
import { LoginUserRequestDto } from '../../dto/request/loginuser.dto';
import { RegisterUserResponse } from '../../dto/response/user.dto';
import { LoginUserResponse } from '../../dto/response/loginuser.response';

import { v4 as uuid } from 'uuid';
import {
  RegisterUserCommand,
  RegisterUserUseCase,
} from '../../application/commands/register-user.usecase';
import {
  LoginUserCommand,
  LoginUserUseCase,
} from '../../application/commands/login-user.usecase';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import type { JwtPayload } from '../../infrastructure/strategies/jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
  ) {}

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

  @Post('login')
  async login(@Body() dto: LoginUserRequestDto): Promise<LoginUserResponse> {
    const command = new LoginUserCommand(dto.email, dto.password);
    const accessToken = await this.loginUserUseCase.execute(command);
    return new LoginUserResponse(accessToken);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@CurrentUser() user: JwtPayload) {
    return { id: user.sub, email: user.email };
  }
}
