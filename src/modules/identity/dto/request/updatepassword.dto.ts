import { IsString, IsStrongPassword, MinLength } from 'class-validator';

export class UpdatePasswordRequestDto {
  @IsString()
  @IsStrongPassword()
  @MinLength(8)
  password: string;

  @IsString()
  @IsStrongPassword()
  @MinLength(8)
  newPassword: string;
}
