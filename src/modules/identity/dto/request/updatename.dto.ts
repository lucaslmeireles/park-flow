import { IsString, MinLength } from 'class-validator';

export class UpdateNameRequestDto {
  @IsString()
  @MinLength(1)
  name: string;
}
