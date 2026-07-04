import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import {
  UserInvalidPasswordException,
  UserNotFound,
} from '../../domain/exceptions/user.exceptions';
import type { PasswordHasher } from '../../domain/services/password-hasher';

export class UpdatePasswordCommand {
  constructor(
    readonly id: string,
    readonly currentPassword: string,
    readonly newPassword: string,
  ) {}
}

@Injectable()
export class UpdatePasswordUseCase {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository,
    @Inject('PasswordHasher')
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(command: UpdatePasswordCommand): Promise<void> {
    const user = await this.userRepository.findById(command.id);
    if (!user) {
      throw new UserNotFound(command.id);
    }

    const isCurrentPasswordValid = await this.passwordHasher.compare(
      command.currentPassword,
      user.getProps().password,
    );

    if (!isCurrentPasswordValid) {
      throw new UserInvalidPasswordException();
    }

    const hashedPassword = await this.passwordHasher.hash(command.newPassword);

    user.updateDetails({ password: hashedPassword });

    await this.userRepository.save(user);
  }
}
