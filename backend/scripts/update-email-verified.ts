import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../src/schemas/user.schema';

async function updateEmailVerified() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

  console.log('Updating emailVerified for all users...');

  const result = await userModel.updateMany(
    { emailVerified: { $ne: true } },
    { $set: { emailVerified: true } }
  );

  console.log(`Updated ${result.modifiedCount} users`);

  await app.close();
}

updateEmailVerified().catch(console.error);