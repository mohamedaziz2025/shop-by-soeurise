import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './src/schemas/user.schema';
import * as bcrypt from 'bcryptjs';

async function checkAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get(getModelToken(User.name)) as Model<UserDocument>;

  console.log('Checking for user with email: admin@soeurise.com');
  const user = await userModel.findOne({ email: 'admin@soeurise.com' });
  if (user) {
    console.log('User found:', user.email, user.role, user.status, user.emailVerified);
    console.log('Password hash starts with:', user.password.substring(0, 10));

    // Test password
    const isValid = await bcrypt.compare('admin123', user.password);
    console.log('Password admin123 valid:', isValid);

    const isValid2 = await bcrypt.compare('Admin123!', user.password);
    console.log('Password Admin123! valid:', isValid2);

    // Check if user would pass login checks
    if (user.status === 'SUSPENDED') {
      console.log('User is suspended');
    } else {
      console.log('User status is OK');
    }

    if (!user.emailVerified) {
      console.log('Email not verified');
    } else {
      console.log('Email is verified');
    }
  } else {
    console.log('User not found');
  }

  await app.close();
}

checkAdmin();