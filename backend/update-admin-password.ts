import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './src/schemas/user.schema';
import * as bcrypt from 'bcryptjs';

async function updateAdminPassword() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get(getModelToken(User.name)) as Model<UserDocument>;

  const admin = await userModel.findOne({ email: 'admin@soeurise.com' });
  if (admin) {
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    admin.password = hashedPassword;
    await admin.save();
    console.log('Admin password updated to: admin123');
  } else {
    console.log('Admin not found');
  }

  await app.close();
}

updateAdminPassword();