import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { ZodValidationPipe } from 'nestjs-zod';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const adapter = new FastifyAdapter({
    logger: false,
    trustProxy: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    {
      bufferLogs: true,
    },
  );

  app.enableShutdownHooks();
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ZodValidationPipe());

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  try {
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 API is running on: http://localhost:${port}/api`);
  } catch (err) {
    logger.error(`❌ Error starting server: ${err}`);
    process.exit(1);
  }
}

void bootstrap();
