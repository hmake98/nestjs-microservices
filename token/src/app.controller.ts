import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtPayload } from 'jsonwebtoken';
import { AppService } from './app.service';
import { IDecodeResponse } from './core/interfaces/IDecodeResponse';
import { ITokenResponse } from './core/interfaces/ITokenResponse';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('token_create')
  public async createToken(@Payload() data: any): Promise<ITokenResponse> {
    return this.appService.createToken(data.id);
  }

  @MessagePattern('token_decode')
  public async decodeToken(
    @Payload() data: string,
  ): Promise<string | JwtPayload | IDecodeResponse> {
    return this.appService.decodeToken(data);
  }
}
