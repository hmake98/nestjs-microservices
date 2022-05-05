import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetPostsDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'No limit provided' })
  public limit: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'No page provided' })
  public page: number;

  @ApiProperty()
  @IsString()
  public term: string;
}
