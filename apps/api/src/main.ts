import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // Enable CORS for frontend connection
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:3002', // Client app
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002',
    ], // Add your frontend URLs
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Zod validation pipe (nestjs-zod)
  app.useGlobalPipes(new ZodValidationPipe());

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Digital Offices API')
    .setDescription(
      'Contract-driven API with authentication endpoints. All types are inferred from Zod schemas in @digitaloffices/contracts.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'bearer',
    )
    .addTag('auth', 'Authentication endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Digital Offices API Docs',
  });

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  try {
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 API is running on: http://localhost:${port}/api`);
    logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  } catch (err) {
    logger.error(`❌ Error starting server: ${err}`);
    process.exit(1);
  }
}

void bootstrap();
