import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetNotificationDto {
  @ApiProperty()
  @IsNumber()
  public skip: number;

  @ApiProperty()
  @IsNumber()
  public limit: number;
}
