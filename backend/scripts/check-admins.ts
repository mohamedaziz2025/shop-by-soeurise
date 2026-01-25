import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../src/schemas/user.schema';

async function checkAdmins() {
  console.log('🔍 Vérification des administrateurs existants...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get(getModelToken(User.name)) as Model<UserDocument>;

  try {
    const admins = await userModel.find({ role: UserRole.ADMIN });

    if (admins.length === 0) {
      console.log('❌ Aucun administrateur trouvé dans la base de données');
      console.log('💡 Utilisez le script create-admin.ts pour créer un administrateur');
    } else {
      console.log(`✅ ${admins.length} administrateur(s) trouvé(s) :`);
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.firstName} ${admin.lastName}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Statut: ${admin.status}`);
        console.log(`   Vérifié: ${admin.emailVerified}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await app.close();
  }
}

checkAdmins();