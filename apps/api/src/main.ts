import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  });

  app.enableShutdownHooks();

  app.useGlobalPipes(new ZodValidationPipe());

  const port = process.env.PORT || 3000;

  try {
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Application is running on: http://localhost:${port}`);
  } catch (err) {
    logger.error(`❌ Error starting server: ${err}`);
    process.exit(1);
  }
}

bootstrap();
