import { Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { sign, decode, JwtPayload } from 'jsonwebtoken';
import { ITokenResponse } from './core/interfaces/ITokenResponse';
import { IDecodeResponse } from './core/interfaces/IDecodeResponse';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  public createToken(userId: number): ITokenResponse {
    const accessExp = this.configService.get('accessExp');
    const refreshExp = this.configService.get('refreshExp');
    const secretKey = this.configService.get('secretKey');
    const accessToken = sign({ userId }, secretKey, { expiresIn: accessExp });
    const refreshToken = sign({ userId }, secretKey, { expiresIn: refreshExp });
    return {
      accessToken,
      refreshToken,
    };
  }

  public async decodeToken(
    token: string,
  ): Promise<string | JwtPayload | IDecodeResponse> {
    return decode(token);
  }
}
