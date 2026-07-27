import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './presentation/controllers/auth.controller';
import { RegisterUserUseCase } from './application/commands/register-user.usecase';
import { LoginUserUseCase } from './application/commands/login-user.usecase';
import { FindUserByIdUseCase } from './application/queries/find-user-by-id.usecase';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { Argon2PasswordHasher } from './infrastructure/providers/argon2-password-hasher';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'changeme'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    FindUserByIdUseCase,
    JwtStrategy,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'PasswordHasher',
      useClass: Argon2PasswordHasher,
    },
  ],
  exports: ['UserRepository', JwtModule],
})
export class IdentityModule {}
