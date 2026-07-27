import { IsBoolean, IsEnum, IsString, MinLength } from 'class-validator';
import { OrganizationType } from 'src/generated/prisma/enums';

export class CreateOrganizationRequestDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsEnum(OrganizationType)
  type!: OrganizationType;

  @IsBoolean()
  active!: boolean;
}
