"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const mongoose_1 = require("@nestjs/mongoose");
const slugify_1 = require("slugify");
const bcrypt = require("bcryptjs");
const user_schema_1 = require("../src/schemas/user.schema");
const shop_schema_1 = require("../src/schemas/shop.schema");
const product_schema_1 = require("../src/schemas/product.schema");
async function seedProducts() {
    try {
        console.log('🌱 Seed produits : démarrage...');
        const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
        const userModel = app.get((0, mongoose_1.getModelToken)(user_schema_1.User.name));
        const shopModel = app.get((0, mongoose_1.getModelToken)(shop_schema_1.Shop.name));
        const productModel = app.get((0, mongoose_1.getModelToken)(product_schema_1.Product.name));
        let seller = await userModel.findOne({ email: 'seller@soeurise.com' });
        if (!seller) {
            const hashed = await bcrypt.hash('Seller123!', 12);
            seller = new userModel({
                firstName: 'Soeurise',
                lastName: 'Seller',
                email: 'seller@soeurise.com',
                password: hashed,
                role: user_schema_1.UserRole.SELLER,
                status: user_schema_1.UserStatus.ACTIVE,
                emailVerified: true,
                phone: '+33100000000',
            });
            await seller.save();
            console.log('✅ Vendeur créé :', seller.email);
        }
        else {
            console.log('ℹ️ Vendeur existant trouvé :', seller.email);
        }
        let shop = await shopModel.findOne({ sellerId: seller._id });
        if (!shop) {
            const shopSlug = (0, slugify_1.default)('Boutique demo', { lower: true, strict: true }) + '-' + Date.now();
            shop = new shopModel({
                sellerId: seller._id,
                name: 'Boutique demo',
                slug: shopSlug,
                description: 'Boutique de démonstration pour seed',
                categories: ['Mode Femme', 'Mode Homme', 'High-Tech'],
                shippingConfig: { enabled: true, estimatedDays: 3 },
            });
            await shop.save();
            console.log('✅ Boutique créée :', shop.name);
        }
        else {
            console.log('ℹ️ Boutique existante trouvée :', shop.name);
        }
        const sampleProducts = [
            {
                name: 'Robe Fleurie Élégante',
                description: 'Belle robe fleurie idéale pour les occasions spéciales.',
                shortDescription: 'Robe fleurie, légère et élégante.',
                price: 49.99,
                mainImage: 'https://via.placeholder.com/600x600.png?text=Robe+Fleurie',
                category: 'Mode Femme',
                tags: ['robe', 'femme', 'fleurie'],
                stock: 10,
                hasVariants: false,
            },
            {
                name: 'T-shirt Homme Classique',
                description: 'T-shirt en coton confortable pour un usage quotidien.',
                shortDescription: 'T-shirt homme, coton 100%.',
                price: 19.99,
                mainImage: 'https://via.placeholder.com/600x600.png?text=T-shirt+Homme',
                category: 'Mode Homme',
                tags: ['tshirt', 'homme'],
                stock: 50,
                hasVariants: true,
            },
            {
                name: 'Casque Bluetooth X200',
                description: 'Casque sans fil avec réduction de bruit et excellente autonomie.',
                shortDescription: 'Casque Bluetooth, réduction de bruit.',
                price: 89.99,
                mainImage: 'https://via.placeholder.com/600x600.png?text=Casque+X200',
                category: 'High-Tech',
                tags: ['audio', 'casque', 'bluetooth'],
                stock: 25,
                hasVariants: false,
            },
        ];
        const created = [];
        for (const p of sampleProducts) {
            const slug = (0, slugify_1.default)(p.name, { lower: true, strict: true }) + '-' + Date.now();
            const existing = await productModel.findOne({ name: p.name, shopId: shop._id });
            if (existing) {
                console.log('⚠️ Produit existant ignoré :', p.name);
                continue;
            }
            const prod = new productModel({
                ...p,
                shopId: shop._id,
                sellerId: seller._id,
                slug,
                status: product_schema_1.ProductStatus.ACTIVE,
            });
            await prod.save();
            created.push(String(prod._id));
            console.log('✅ Produit créé :', p.name);
        }
        if (created.length > 0) {
            await shopModel.findByIdAndUpdate(shop._id, { $inc: { totalProducts: created.length } });
        }
        console.log(`🌱 Seed produits terminé. ${created.length} produit(s) créés.`);
        await app.close();
    }
    catch (error) {
        console.error('❌ Erreur seed produits :', error);
        process.exit(1);
    }
}
seedProducts();
//# sourceMappingURL=seed-products.js.map