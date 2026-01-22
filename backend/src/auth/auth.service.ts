import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { User, UserDocument, UserStatus } from '../schemas/user.schema';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(registerDto: RegisterDto) {
    this.logger.debug(`register attempt for email: ${registerDto.email}`);
    
    // Vérifier si l'email existe déjà
    const existingUser = await this.userModel.findOne({
      email: registerDto.email,
    });

    if (existingUser) {
      this.logger.warn(`register failed: email already exists (${registerDto.email})`);
      throw new UnauthorizedException('Cet email est déjà utilisé');
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Générer un token de vérification d'email
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Créer l'utilisateur avec email non vérifié
    const user = new this.userModel({
      ...registerDto,
      password: hashedPassword,
      emailVerified: false,
      emailVerificationToken,
      status: 'PENDING_VERIFICATION', // Statut en attente de vérification
    });

    await user.save();
    this.logger.log(`user registered: ${registerDto.email} (ID: ${user._id})`);

    // TODO: Envoyer l'email de vérification
    await this.sendVerificationEmail(user.email, emailVerificationToken);

    // Ne pas générer de tokens JWT tant que l'email n'est pas vérifié
    return {
      message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    };
  }

  /**
   * Connexion
   */
  async login(loginDto: LoginDto) {
    this.logger.debug(`login attempt for email: ${loginDto.email}`);
    
    const user = await this.userModel.findOne({ email: loginDto.email });

    if (!user) {
      this.logger.warn(`login failed: user not found (email: ${loginDto.email})`);
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    this.logger.debug(`user found: ${user._id}, verified: ${user.emailVerified}, status: ${user.status}`);

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      this.logger.warn(`login failed: invalid password for ${loginDto.email}`);
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    this.logger.debug(`password valid for ${loginDto.email}`);

    // Vérifier si l'email est vérifié
    if (!user.emailVerified) {
      this.logger.warn(`login failed: email not verified for ${loginDto.email}`);
      throw new UnauthorizedException('Veuillez vérifier votre email avant de vous connecter. Vérifiez votre boîte de réception.');
    }

    // Vérifier le statut du compte
    if (user.status === 'SUSPENDED') {
      this.logger.warn(`login failed: account suspended for ${loginDto.email}`);
      throw new UnauthorizedException('Votre compte a été suspendu');
    }

    this.logger.log(`login success for ${loginDto.email}`);

    // Mettre à jour la date de dernière connexion
    user.lastLoginAt = new Date();

    // Générer les tokens
    const tokens = await this.generateTokens(user);

    // Sauvegarder le refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      user: user.toJSON(),
      ...tokens,
    };
  }

  /**
   * Rafraîchir le token d'accès
   */
  async refreshToken(refreshToken: string) {
    try {
      this.logger.debug(`refreshToken called`);
      this.logger.debug(`incoming refreshToken: ${refreshToken ? '[REDACTED]' : 'null'}`);

      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      this.logger.debug(`refresh token payload: ${JSON.stringify(payload)}`);

      const user = await this.userModel.findById(payload.sub);

      if (!user) {
        this.logger.warn(`refresh failed: user not found (sub=${payload.sub})`);
        throw new UnauthorizedException('Token invalide');
      }

      this.logger.debug(`stored refreshToken for user ${user._id}: ${user.refreshToken ? '[REDACTED]' : 'null'}`);

      if (user.refreshToken !== refreshToken) {
        this.logger.warn(`refresh failed: token mismatch for user ${user._id}`);
        throw new UnauthorizedException('Token invalide');
      }

      const tokens = await this.generateTokens(user);
      user.refreshToken = tokens.refreshToken;
      await user.save();

      this.logger.log(`refresh success for user ${user._id}`);

      return tokens;
    } catch (err) {
      this.logger.warn(`refreshToken error: ${err?.message || err}`);
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  /**
   * Déconnexion
   */
  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
    return { message: 'Déconnexion réussie' };
  }

  /**
   * Générer les tokens JWT (access + refresh)
   */
  private async generateTokens(user: UserDocument) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Valider un utilisateur (utilisé par Passport)
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user.toJSON();
    }

    return null;
  }

  /**
   * Mot de passe oublié
   */
  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      // Pour des raisons de sécurité, ne pas révéler si l'email existe
      return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
    }

    // Générer un token de réinitialisation
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 heure

    await user.save();

    // TODO: Envoyer email avec le lien de réinitialisation
    // await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
  }

  /**
   * Réinitialiser le mot de passe
   */
  async resetPassword(token: string, newPassword: string) {
    const user = await this.userModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    // Hash du nouveau mot de passe
    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  /**
   * Vérifier l'email avec le token
   */
  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({
      emailVerificationToken: token,
    });

    if (!user) {
      throw new BadRequestException('Token de vérification invalide');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Cet email est déjà vérifié');
    }

    // Vérifier et activer le compte
    user.emailVerified = true;
    user.emailVerificationToken = undefined; // Supprimer le token
    user.status = UserStatus.ACTIVE; // Activer le compte
    await user.save();

    return {
      message: 'Email vérifié avec succès. Votre compte est maintenant actif.',
      user: user.toJSON(),
    };
  }

  /**
   * Renvoyer l'email de vérification
   */
  async resendVerificationEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Utilisateur introuvable');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Cet email est déjà vérifié');
    }

    // Générer un nouveau token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = emailVerificationToken;
    await user.save();

    // Renvoyer l'email de vérification
    await this.sendVerificationEmail(user.email, emailVerificationToken);

    return {
      message: 'Un nouvel email de vérification a été envoyé',
    };
  }

  /**
   * Envoyer l'email de vérification (méthode privée)
   */
  private async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

    this.logger.debug(`sendVerificationEmail: preparing email for ${email}`);
    this.logger.debug(`SMTP config - host: ${this.configService.get('MAIL_HOST')}, port: ${this.configService.get('MAIL_PORT')}, user: ${this.configService.get('MAIL_USER')}`);

    // Créer le transporteur nodemailer
    const transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: parseInt(this.configService.get('MAIL_PORT') || '587'),
      secure: this.configService.get('MAIL_SECURE') === 'true', // true for 465, false for other ports
      requireTLS: this.configService.get('MAIL_TLS') === 'true',
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });

    // Options de l'email
    const mailOptions = {
      from: this.configService.get('MAIL_FROM'),
      to: email,
      subject: 'Vérifiez votre compte Soeurise',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Bienvenue sur Soeurise !</h2>
          <p>Merci de vous être inscrit sur notre marketplace communautaire.</p>
          <p>Pour activer votre compte et commencer à utiliser Soeurise, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Vérifier mon email</a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p style="color: #666; font-size: 14px;">Ce lien expirera dans 24 heures.</p>
          <p style="color: #666; font-size: 14px;">Si vous n'avez pas créé de compte sur Soeurise, ignorez cet email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">Soeurise - Marketplace communautaire</p>
        </div>
      `,
    };

    try {
      this.logger.debug(`sendVerificationEmail: connecting to SMTP host ${this.configService.get('MAIL_HOST')}`);
      await transporter.sendMail(mailOptions);
      this.logger.log(`✓ Email de vérification envoyé à ${email}`);
    } catch (error) {
      this.logger.error(`✗ Erreur lors de l'envoi de l'email à ${email}: ${error?.message || error}`);
      // Ne pas throw l'erreur pour ne pas bloquer l'inscription
      // L'utilisateur pourra utiliser la fonctionnalité de renvoi
    }
  }
}
