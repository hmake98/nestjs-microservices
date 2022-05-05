import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const configService = new ConfigService();
  const logger = new Logger();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`${configService.get('rb_url')}`],
        queue: `${configService.get('token_queue')}`,
        queueOptions: { durable: false },
      },
    },
  );
  await app.listen();
  logger.log('🚀 Token service started');
}
bootstrap();
