import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole, UserStatus } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

const logger = new Logger('Bootstrap');

async function seedAdminIfNotExists(app) {
  try {
    logger.debug('seedAdminIfNotExists: starting admin check');
    const userModel = app.get(getModelToken(User.name)) as Model<UserDocument>;
    
    const existingAdmin = await userModel.findOne({ role: UserRole.ADMIN });
    if (existingAdmin) {
      logger.log(`✓ Admin already exists: ${existingAdmin.email} (verified: ${existingAdmin.emailVerified}, status: ${existingAdmin.status})`);
      return;
    }

    logger.log('Creating default admin user...');
    const hashedPassword = await bcrypt.hash('Admin123!', 12);

    const adminUser = new userModel({
      firstName: 'Admin',
      lastName: 'Shop By Soeurise',
      email: 'admin@shopbysoeurise.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      phone: '+33123456789',
    });

    const savedAdmin = await adminUser.save();
    logger.log(`✓ Admin user created successfully: admin@soeurise.com (ID: ${savedAdmin._id})`);
    logger.debug(`Admin details - verified: ${savedAdmin.emailVerified}, status: ${savedAdmin.status}, role: ${savedAdmin.role}`);
  } catch (error) {
    logger.error(`✗ Error seeding admin: ${error?.message || error}`);
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuration globale
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 4000;
  const apiPrefix = configService.get('API_PREFIX') || 'api/v1';

  logger.log(`Initializing Soeurise API on port ${port}`);

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

  // Static assets for uploads
  const uploadDir = join(process.cwd(), 'uploads');
  const logosDir = join(uploadDir, 'logos');
  try {
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true });
  } catch (e) {
    logger.error(`Error creating upload directories: ${e}`);
  }
  app.useStaticAssets(uploadDir, { prefix: '/uploads' });

  await app.listen(port);
  logger.log(`✓ Soeurise API running on: http://72.62.71.97:${port}/${apiPrefix}`);
  
  // Seed admin si nécessaire
  await seedAdminIfNotExists(app);
}

bootstrap();
