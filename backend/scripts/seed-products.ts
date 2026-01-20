import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import * as bcrypt from 'bcryptjs';

import { User, UserDocument, UserRole, UserStatus } from '../src/schemas/user.schema';
import { Shop, ShopDocument } from '../src/schemas/shop.schema';
import { Product, ProductDocument, ProductStatus } from '../src/schemas/product.schema';

async function seedProducts() {
  try {
    console.log('🌱 Seed produits : démarrage...');

    const app = await NestFactory.createApplicationContext(AppModule);

    const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
    const shopModel = app.get<Model<ShopDocument>>(getModelToken(Shop.name));
    const productModel = app.get<Model<ProductDocument>>(getModelToken(Product.name));

    // 1) Créer (ou retrouver) un vendeur
    let seller = await userModel.findOne({ email: 'seller@soeurise.com' });
    if (!seller) {
      const hashed = await bcrypt.hash('Seller123!', 12);
      seller = new userModel({
        firstName: 'Soeurise',
        lastName: 'Seller',
        email: 'seller@soeurise.com',
        password: hashed,
        role: UserRole.SELLER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        phone: '+33100000000',
      });
      await seller.save();
      console.log('✅ Vendeur créé :', seller.email);
    } else {
      console.log('ℹ️ Vendeur existant trouvé :', seller.email);
    }

    // 2) Créer (ou retrouver) une boutique pour ce vendeur
    let shop = await shopModel.findOne({ sellerId: seller._id });
    if (!shop) {
      const shopSlug = slugify('Boutique demo', { lower: true, strict: true }) + '-' + Date.now();
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
    } else {
      console.log('ℹ️ Boutique existante trouvée :', shop.name);
    }

    // 3) Produits à insérer
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

    const created: string[] = [];

    for (const p of sampleProducts) {
      const slug = slugify(p.name, { lower: true, strict: true }) + '-' + Date.now();

      // Ne pas dupliquer si un produit avec le même nom existe pour cette boutique
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
        status: ProductStatus.ACTIVE,
      });

      await prod.save();
      created.push(String(prod._id));
      console.log('✅ Produit créé :', p.name);
    }

    // Mettre à jour le compteur de produits de la boutique
    if (created.length > 0) {
      await shopModel.findByIdAndUpdate(shop._id, { $inc: { totalProducts: created.length } });
    }

    console.log(`🌱 Seed produits terminé. ${created.length} produit(s) créés.`);

    await app.close();
  } catch (error) {
    console.error('❌ Erreur seed produits :', error);
    process.exit(1);
  }
}

seedProducts();
