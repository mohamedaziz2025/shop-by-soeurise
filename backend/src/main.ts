import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration globale
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 4000;
  const apiPrefix = configService.get('API_PREFIX') || 'api/v1';

  // CORS - Configuration permissive pour le développement
  app.enableCors({
    origin: true, // Permet toutes les origines
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  });

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);
  console.log(`🚀 Soeurise API running on: http://72.62.71.97:${port}/${apiPrefix}`);
}

bootstrap();
