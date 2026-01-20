"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const user_schema_1 = require("../src/schemas/user.schema");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcryptjs");
async function seedAdmin() {
    try {
        console.log('🌱 Initialisation de l\'utilisateur admin par défaut...');
        const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
        const userModel = app.get((0, mongoose_1.getModelToken)(user_schema_1.User.name));
        const existingAdmin = await userModel.findOne({ role: user_schema_1.UserRole.ADMIN });
        if (existingAdmin) {
            console.log('✅ Un utilisateur admin existe déjà:', existingAdmin.email);
            await app.close();
            return;
        }
        const hashedPassword = await bcrypt.hash('Admin123!', 12);
        const adminUser = new userModel({
            firstName: 'Admin',
            lastName: 'Soeurise',
            email: 'admin@soeurise.com',
            password: hashedPassword,
            role: user_schema_1.UserRole.ADMIN,
            status: user_schema_1.UserStatus.ACTIVE,
            emailVerified: true,
            phone: '+33123456789',
        });
        await adminUser.save();
        console.log('✅ Utilisateur admin créé avec succès!');
        console.log('📧 Email: admin@soeurise.com');
        console.log('🔑 Mot de passe: Admin123!');
        console.log('⚠️  Veuillez changer ce mot de passe après la première connexion!');
        await app.close();
    }
    catch (error) {
        console.error('❌ Erreur lors de la création de l\'admin:', error);
        process.exit(1);
    }
}
seedAdmin();
//# sourceMappingURL=seed-admin.js.map