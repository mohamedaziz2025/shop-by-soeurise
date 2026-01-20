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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const user_schema_1 = require("../schemas/user.schema");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findById(id) {
        const user = await this.userModel.findById(id).populate('sellerProfile');
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
        return user;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email });
    }
    async updateProfile(userId, updateUserDto) {
        if (updateUserDto.email) {
            const existingUser = await this.userModel.findOne({
                email: updateUserDto.email,
                _id: { $ne: userId },
            });
            if (existingUser) {
                throw new common_1.BadRequestException('Cet email est déjà utilisé');
            }
        }
        const user = await this.userModel.findByIdAndUpdate(userId, { $set: updateUserDto }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
        return user.toJSON();
    }
    async changePassword(userId, changePasswordDto) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
        const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Mot de passe actuel incorrect');
        }
        user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await user.save();
        return { message: 'Mot de passe modifié avec succès' };
    }
    async deleteAccount(userId) {
        const user = await this.userModel.findByIdAndDelete(userId);
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
        return { message: 'Compte supprimé avec succès' };
    }
    async findAll(filters) {
        const query = {};
        if (filters?.role) {
            query.role = filters.role;
        }
        if (filters?.status) {
            query.status = filters.status;
        }
        return this.userModel.find(query).select('-password -refreshToken').sort({ createdAt: -1 });
    }
    async updateStatus(userId, status) {
        const user = await this.userModel.findByIdAndUpdate(userId, { status }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
        return user.toJSON();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map