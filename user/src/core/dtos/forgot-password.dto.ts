import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'New password not provided' })
  public newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Token not provided' })
  public token: string;
}
