import { Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { ResponseInterceptor } from './core/response.interceptor';

const docsEndpoint = '/docs';
const title = process.env.POST_HOST;

function configureSwagger(app): void {
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription('API Description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docsEndpoint, app, document);
}

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({ origin: '*' });

  const moduleRef = app.select(AppModule);
  const reflector = moduleRef.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));

  configureSwagger(app);

  // Then combine it with a RabbitMQ microservice
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [`${configService.get('rb_url')}`],
      queue: `${configService.get('post_queue')}`,
      queueOptions: { durable: false },
      prefetchCount: 1,
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get('servicePort'));
  logger.log(
    `🚀 Post service running on port ${configService.get('servicePort')}`,
  );
}
bootstrap();
