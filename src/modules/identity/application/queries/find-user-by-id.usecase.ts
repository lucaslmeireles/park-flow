import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { UserNotFound } from '../../domain/exceptions/user.exceptions';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFound(id);
    }
    return user;
  }
}
