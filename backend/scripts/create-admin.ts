import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole, UserStatus } from '../src/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createAdmin() {
  console.log('🔧 Création d\'un nouvel administrateur\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get(getModelToken(User.name)) as Model<UserDocument>;

  try {
    const firstName = await question('Prénom: ');
    const lastName = await question('Nom: ');
    const email = await question('Email: ');
    const password = await question('Mot de passe: ');
    const phone = await question('Téléphone (optionnel): ');

    // Vérifier si l'email existe déjà
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.error(`❌ Un utilisateur avec l'email ${email} existe déjà`);
      rl.close();
      await app.close();
      process.exit(1);
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'admin
    const adminUser = new userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      phone: phone || undefined,
    });

    const savedAdmin = await adminUser.save();
    
    console.log('\n✅ Administrateur créé avec succès!');
    console.log(`   Email: ${savedAdmin.email}`);
    console.log(`   ID: ${savedAdmin._id}`);
    console.log(`   Nom: ${savedAdmin.firstName} ${savedAdmin.lastName}`);
    console.log(`   Rôle: ${savedAdmin.role}`);
    console.log(`   Statut: ${savedAdmin.status}\n`);

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error?.message || error);
  } finally {
    rl.close();
    await app.close();
    process.exit(0);
  }
}

createAdmin();
