import { Inject } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { UserNotFound } from '../../domain/exceptions/user.exceptions';

export class UpdateNameCommand {
  constructor(
    readonly id: string,
    readonly name: string,
  ) {}
}

export class UpdateNameUseCase {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository,
  ) {}

  async excute(command: UpdateNameCommand): Promise<void> {
    const user = await this.userRepository.findById(command.id);
    if (!user) {
      throw new UserNotFound(command.id);
    }

    user.updateDetails({ name: command.name });
    await this.userRepository.save(user);
  }
}
