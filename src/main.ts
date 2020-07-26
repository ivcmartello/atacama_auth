import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('Auth');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      url: process.env.BROKER_URL,
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(parseInt(process.env.PORT, 10) || 3001);
  logger.log('Microservice running');
}
bootstrap();
