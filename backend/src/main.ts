import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole, UserStatus } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

async function seedAdminIfNotExists(app) {
  try {
    const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
    
    const existingAdmin = await userModel.findOne({ role: UserRole.ADMIN });
    if (existingAdmin) {
      console.log('✅ Admin existe déjà:', existingAdmin.email);
      return;
    }

    console.log('🌱 Création de l\'admin par défaut...');
    const hashedPassword = await bcrypt.hash('Admin123!', 12);

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

    await adminUser.save();
    console.log('✅ Admin créé: admin@soeurise.com / Admin123!');
  } catch (error) {
    console.error('❌ Erreur seed admin:', error.message);
  }
}

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
  
  // Seed admin si nécessaire
  await seedAdminIfNotExists(app);
}

bootstrap();
