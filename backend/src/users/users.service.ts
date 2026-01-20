import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schemas/user.schema';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Récupérer un utilisateur par ID
   */
  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).populate('sellerProfile');

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }

  /**
   * Récupérer un utilisateur par email
   */
  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    // Vérifier si l'email est déjà utilisé
    if (updateUserDto.email) {
      const existingUser = await this.userModel.findOne({
        email: updateUserDto.email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        throw new BadRequestException('Cet email est déjà utilisé');
      }
    }

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateUserDto },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user.toJSON();
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Mot de passe actuel incorrect');
    }

    // Hash du nouveau mot de passe
    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await user.save();

    return { message: 'Mot de passe modifié avec succès' };
  }

  /**
   * Supprimer un compte utilisateur
   */
  async deleteAccount(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return { message: 'Compte supprimé avec succès' };
  }

  /**
   * Récupérer tous les utilisateurs (ADMIN)
   */
  async findAll(filters?: { role?: string; status?: string }) {
    const query: any = {};

    if (filters?.role) {
      query.role = filters.role;
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    return this.userModel.find(query).select('-password -refreshToken').sort({ createdAt: -1 });
  }

  /**
   * Mettre à jour le statut d'un utilisateur (ADMIN)
   */
  async updateStatus(userId: string, status: string) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { status },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user.toJSON();
  }
}
