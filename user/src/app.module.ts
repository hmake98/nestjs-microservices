import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { UserRepository } from './database/repository/user.repository';
import { Connection } from 'typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from './config/config.service';
import { TokenRepository } from './database/repository/token.repository';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ClientAuthGuard } from './core/guards/auth.guard';
import { AllExceptionsFilter } from './core/exception.interceptor';
import { LocalizationModule } from '@squareboat/nestjs-localization/dist/src';
import { GoogleOauthModule } from './modules';
import * as path from 'path';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    LocalizationModule.register({
      path: path.join(__dirname, '/locales/'),
      fallbackLang: 'en',
    }),
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
      {
        name: 'MAIL_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('rb_url')}`],
            queue: `${configService.get('mailer_queue')}`,
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    // GoogleOauthModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    AppService,
    {
      provide: UserRepository,
      useFactory: (connection: Connection) =>
        connection.getCustomRepository(UserRepository),
      inject: [Connection],
    },
    {
      provide: TokenRepository,
      useFactory: (connection: Connection) =>
        connection.getCustomRepository(TokenRepository),
      inject: [Connection],
    },
    {
      provide: APP_GUARD,
      useClass: ClientAuthGuard,
    },
  ],
})
export class AppModule {}
