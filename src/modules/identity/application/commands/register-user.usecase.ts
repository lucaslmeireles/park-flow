import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { UserEmailAlreadyExistsException } from '../../domain/exceptions/user.exceptions';
import { User } from '../../domain/entities/user';
import type { PasswordHasher } from '../../domain/services/password-hasher';

export class RegisterUserCommand {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly password: string,
  ) {}
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository,
    @Inject('PasswordHasher')
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    if (await this.userRepository.findByEmail(command.email)) {
      throw new UserEmailAlreadyExistsException(command.email);
    }

    const hashedPassword = await this.passwordHasher.hash(command.password);

    const user = User.create(
      command.id,
      command.name,
      command.email,
      hashedPassword,
    );
    await this.userRepository.save(user);
  }
}
