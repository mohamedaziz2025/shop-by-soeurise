"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const user_schema_1 = require("../schemas/user.schema");
let AuthService = class AuthService {
    constructor(userModel, jwtService, configService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        const existingUser = await this.userModel.findOne({
            email: registerDto.email,
        });
        if (existingUser) {
            throw new common_1.UnauthorizedException('Cet email est déjà utilisé');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = new this.userModel({
            ...registerDto,
            password: hashedPassword,
        });
        await user.save();
        const tokens = await this.generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();
        return {
            user: user.toJSON(),
            ...tokens,
        };
    }
    async login(loginDto) {
        const user = await this.userModel.findOne({ email: loginDto.email });
        if (!user) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        if (user.status === 'SUSPENDED') {
            throw new common_1.UnauthorizedException('Votre compte a été suspendu');
        }
        user.lastLoginAt = new Date();
        const tokens = await this.generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();
        return {
            user: user.toJSON(),
            ...tokens,
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.userModel.findById(payload.sub);
            if (!user || user.refreshToken !== refreshToken) {
                throw new common_1.UnauthorizedException('Token invalide');
            }
            const tokens = await this.generateTokens(user);
            user.refreshToken = tokens.refreshToken;
            await user.save();
            return tokens;
        }
        catch {
            throw new common_1.UnauthorizedException('Token invalide ou expiré');
        }
    }
    async logout(userId) {
        await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
        return { message: 'Déconnexion réussie' };
    }
    async generateTokens(user) {
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
    async validateUser(email, password) {
        const user = await this.userModel.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            return user.toJSON();
        }
        return null;
    }
    async forgotPassword(email) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
        }
        const resetToken = Math.random().toString(36).substring(2, 15);
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = new Date(Date.now() + 3600000);
        await user.save();
        return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
    }
    async resetPassword(token, newPassword) {
        const user = await this.userModel.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Token invalide ou expiré');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        return { message: 'Mot de passe réinitialisé avec succès' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map