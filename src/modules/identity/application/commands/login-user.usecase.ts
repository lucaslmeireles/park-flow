import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { PasswordHasher } from '../../domain/services/password-hasher';
import { UserInvalidPasswordException } from '../../domain/exceptions/user.exceptions';

export class LoginUserCommand {
  constructor(
    readonly email: string,
    readonly password: string,
  ) {}
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository,
    @Inject('PasswordHasher')
    private passwordHasher: PasswordHasher,
    private jwtService: JwtService,
  ) {}

  async execute(command: LoginUserCommand): Promise<string> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new UserInvalidPasswordException();
    }

    const isValidPassword = await this.passwordHasher.compare(
      command.password,
      user.getPassword(),
    );

    if (!isValidPassword) {
      throw new UserInvalidPasswordException();
    }

    return this.jwtService.sign({
      sub: user.getId(),
      email: user.getEmail(),
    });
  }
}
