import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetPresignUrlDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No fileName provided' })
  public fileName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No type provided' })
  public type: string;
}
