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
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const adminUser = new userModel({
      firstName: 'Admin',
      lastName: 'Soeurise',
      email: 'admin@soeurise.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      phone: '+33123456789',
    });

    const savedAdmin = await adminUser.save();
    logger.log(`✓ Admin user created successfully: ${savedAdmin.email} (ID: ${savedAdmin._id})`);
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
    optionsSuccessStatus: 200,
    preflightContinue: true,
  });

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // Static assets for uploads with CORS headers
  const uploadDir = join(process.cwd(), 'uploads');
  const logosDir = join(uploadDir, 'logos');
  try {
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true });
  } catch (e) {
    logger.error(`Error creating upload directories: ${e}`);
  }
  
  // Serve static assets with proper CORS headers
  app.use((req, res, next) => {
    if (req.path.startsWith('/uploads')) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    }
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
  
  app.useStaticAssets(uploadDir, { prefix: '/uploads' });

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
  logger.log(`✓ Soeurise API running on: http://72.62.71.97:${port}/${apiPrefix}`);
  
  // Seed admin si nécessaire
  await seedAdminIfNotExists(app);
}

bootstrap();
