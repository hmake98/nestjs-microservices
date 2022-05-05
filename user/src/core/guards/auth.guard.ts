import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ClientAuthGuard implements CanActivate {
  exlcudeRequests = [
    '/login',
    '/signup',
    '/google-oauth',
    '/google-oauth/redirect',
  ];
  public constructor(
    @Inject('TOKEN_SERVICE') private readonly client: ClientProxy,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.getArgByIndex(0);
      if (this.exlcudeRequests.includes(request.url.split('?')[0])) {
        return true;
      }
      const Authorization = request.headers['authorization'];
      if (!Authorization) {
        throw new UnauthorizedException();
      }
      const token = Authorization.replace('Bearer ', '');
      await this.client.connect();
      const decode = await firstValueFrom(
        this.client.send('token_decode', token),
      );
      if (!decode) {
        throw new UnauthorizedException();
      }
      console.log(decode);
      request.userId = decode.userId;
      return true;
    } catch (e) {
      return false;
    }
  }
}
