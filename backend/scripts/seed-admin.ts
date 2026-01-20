import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { User, UserDocument, UserRole, UserStatus } from '../src/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

async function seedAdmin() {
  try {
    console.log('🌱 Initialisation de l\'utilisateur admin par défaut...');

    const app = await NestFactory.createApplicationContext(AppModule);
    const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

    // Vérifier si un admin existe déjà
    const existingAdmin = await userModel.findOne({ role: UserRole.ADMIN });
    if (existingAdmin) {
      console.log('✅ Un utilisateur admin existe déjà:', existingAdmin.email);
      await app.close();
      return;
    }

    // Créer l'utilisateur admin par défaut
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

    console.log('✅ Utilisateur admin créé avec succès!');
    console.log('📧 Email: admin@soeurise.com');
    console.log('🔑 Mot de passe: Admin123!');
    console.log('⚠️  Veuillez changer ce mot de passe après la première connexion!');

    await app.close();
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
    process.exit(1);
  }
}

// Exécuter le script
seedAdmin();