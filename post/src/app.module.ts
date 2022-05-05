import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { Connection } from 'typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from './config/config.service';
import { PostRepository } from './database/repository/post.repository';
import { APP_GUARD } from '@nestjs/core';
import { ClientAuthGuard } from './core/guards/auth.guard';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'TOKEN_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
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
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('rb_url')}`],
            queue: `${configService.get('user_queue')}`,
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
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ClientAuthGuard,
    },
    AppService,
    {
      provide: PostRepository,
      useFactory: (connection: Connection) =>
        connection.getCustomRepository(PostRepository),
      inject: [Connection],
    },
  ],
})
export class AppModule {}
