import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole } from '../schemas/user.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { SellerProfile, SellerProfileDocument } from '../schemas/seller-profile.schema';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';
import { BecomeSellerDto } from './dto/become-seller.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(SellerProfile.name) private sellerProfileModel: Model<SellerProfileDocument>,
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

  /**
   * Récupérer les favoris d'un utilisateur
   */
  async getFavorites(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('favorites')
      .select('favorites');

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user.favorites || [];
  }

  /**
   * Ajouter un produit aux favoris
   */
  async addToFavorites(userId: string, productId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    if (!user.favorites) {
      user.favorites = [];
    }

    if (user.favorites.includes(productId)) {
      throw new BadRequestException('Produit déjà dans les favoris');
    }

    user.favorites.push(productId);
    await user.save();

    return { message: 'Produit ajouté aux favoris', favorites: user.favorites };
  }

  /**
   * Retirer un produit des favoris
   */
  async removeFromFavorites(userId: string, productId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (!user.favorites || !user.favorites.includes(productId)) {
      throw new BadRequestException('Produit non trouvé dans les favoris');
    }

    user.favorites = user.favorites.filter((id) => id.toString() !== productId);
    await user.save();

    return { message: 'Produit retiré des favoris', favorites: user.favorites };
  }

  /**
   * Permettre à un client de devenir vendeur
   */
  async becomeSeller(userId: string, becomeSellerDto: BecomeSellerDto) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // Vérifier que l'utilisateur est bien un client
    if (user.role !== UserRole.CLIENT) {
      throw new BadRequestException('Seuls les clients peuvent devenir vendeurs');
    }

    // Vérifier si l'utilisateur a déjà un profil vendeur
    const existingProfile = await this.sellerProfileModel.findOne({ userId });
    if (existingProfile) {
      throw new BadRequestException('Vous avez déjà une demande de vendeur en cours ou êtes déjà vendeur');
    }

    // Créer le profil vendeur
    const sellerProfile = new this.sellerProfileModel({
      userId,
      businessName: becomeSellerDto.businessName,
      businessDescription: becomeSellerDto.businessDescription,
      siret: becomeSellerDto.siret,
      tvaNumber: becomeSellerDto.tvaNumber,
      legalForm: becomeSellerDto.legalForm,
      businessAddress: {
        street: becomeSellerDto.businessStreet,
        city: becomeSellerDto.businessCity,
        postalCode: becomeSellerDto.businessPostalCode,
        country: becomeSellerDto.businessCountry || 'France',
      },
      businessEmail: becomeSellerDto.businessEmail,
      businessPhone: becomeSellerDto.businessPhone,
      logo: becomeSellerDto.logo,
    });

    await sellerProfile.save();

    // Mettre à jour le rôle de l'utilisateur
    user.role = UserRole.SELLER;
    user.sellerProfile = sellerProfile._id.toString();
    await user.save();

    return {
      message: 'Votre demande de vendeur a été soumise avec succès. Elle sera examinée par notre équipe.',
      sellerProfile: sellerProfile.toJSON(),
      user: user.toJSON(),
    };
  }

  /**
   * Mettre à jour le logo du profil vendeur
   */
  async updateSellerProfileLogo(userId: string, logoUrl: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (user.role !== UserRole.SELLER) {
      throw new BadRequestException('L\'utilisateur n\'est pas un vendeur');
    }

    if (!user.sellerProfile) {
      throw new BadRequestException('Profil vendeur introuvable');
    }

    const sellerProfile = await this.sellerProfileModel.findByIdAndUpdate(
      user.sellerProfile,
      { logo: logoUrl },
      { new: true },
    );

    if (!sellerProfile) {
      throw new NotFoundException('Profil vendeur introuvable');
    }

    return {
      message: 'Logo du profil vendeur mis à jour avec succès',
      logo: logoUrl,
      sellerProfile: sellerProfile.toJSON(),
    };
  }
}
