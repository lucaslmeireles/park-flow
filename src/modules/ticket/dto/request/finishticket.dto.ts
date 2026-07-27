import { IsDateString, IsOptional } from 'class-validator';

export class FinishTicketRequestDto {
  @IsOptional()
  @IsDateString({ strict: true })
  endedAt?: string;
}
