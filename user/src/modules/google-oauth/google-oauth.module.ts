import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOAuthStrategy } from './google-oauth.strategy';
import { GoogleOauthService } from './google-oauth.service';
import { UserRepository } from 'src/database/repository/user.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from 'src/config/config.service';
import { Connection } from 'typeorm';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    ClientsModule.registerAsync([
      {
        name: 'TOKEN_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('rb_url')}`],
            queue: `${configService.get('token_queue')}`,
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [GoogleOauthController],
  providers: [
    GoogleOAuthStrategy,
    GoogleOauthService,
    {
      provide: UserRepository,
      useFactory: (connection: Connection) =>
        connection.getCustomRepository(UserRepository),
      inject: [Connection],
    },
  ],
})
export class GoogleOauthModule {}
