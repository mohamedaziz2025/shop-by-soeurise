import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import { Product, ProductDocument, ProductStatus } from '../schemas/product.schema';
import { ProductVariant, ProductVariantDocument } from '../schemas/product-variant.schema';
import { Shop, ShopDocument } from '../schemas/shop.schema';
import { CreateProductDto, UpdateProductDto, CreateVariantDto, UpdateVariantDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductVariant.name) private variantModel: Model<ProductVariantDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
  ) {}

  /**
   * Créer un produit (SELLER)
   */
  async create(sellerId: string, createProductDto: CreateProductDto) {
    // Récupérer la boutique du vendeur
    const shop = await this.shopModel.findOne({ sellerId });

    if (!shop) {
      throw new NotFoundException('Vous devez créer une boutique avant de créer des produits');
    }

    // Générer le slug
    const slug = slugify(createProductDto.name, { lower: true, strict: true }) + '-' + Date.now();

    const product = new this.productModel({
      ...createProductDto,
      shopId: shop._id,
      sellerId,
      slug,
    });

    await product.save();

    // Mettre à jour le compteur de produits de la boutique
    await this.shopModel.findByIdAndUpdate(shop._id, {
      $inc: { totalProducts: 1 },
    });

    return product;
  }

  /**
   * Récupérer tous les produits (publics - filtrés)
   */
  async findAll(filters?: {
    shopId?: string;
    category?: string;
    status?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    isFeatured?: boolean;
  }) {
    const query: any = { status: ProductStatus.ACTIVE };

    if (filters?.shopId) {
      query.shopId = filters.shopId;
    }

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.search) {
      query.$text = { $search: filters.search };
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }

    if (filters?.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    if (filters?.isFeatured !== undefined) {
      query.isFeatured = filters.isFeatured;
    }

    // Support for dynamic filters (size, color, brand, condition, material, etc.)
    // If unknown filter keys are provided, try to match them against variant options' values
    const knownKeys = [
      'shopId',
      'category',
      'status',
      'search',
      'minPrice',
      'maxPrice',
      'tags',
      'isFeatured',
      'limit',
      'sortBy',
    ];

    const dynamicKeys = Object.keys(filters || {}).filter((k) => !knownKeys.includes(k));

    if (dynamicKeys.length > 0) {
      // Collect values to search in variant options
      const valuesToMatch: string[] = [];
      dynamicKeys.forEach((k) => {
        const v = (filters as any)[k];
        if (v !== undefined && v !== null && v !== '') {
          // If it's an array, add all values; otherwise add single
          if (Array.isArray(v)) valuesToMatch.push(...v.map(String));
          else valuesToMatch.push(String(v));
        }
      });

      if (valuesToMatch.length > 0) {
        // Find variants that contain any of these option values
        const matchingVariants = await this.variantModel.find({ 'options.value': { $in: valuesToMatch } }).select('productId').lean();
        const productIds = Array.from(new Set(matchingVariants.map((mv) => String(mv.productId))));

        // If no variants matched, return empty
        if (productIds.length === 0) {
          return [];
        }

        // Restrict products to the matched productIds
        query._id = { $in: productIds };
      }
    }

    return this.productModel
      .find(query)
      .populate('shopId', 'name slug logo')
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(100);
  }

  /**
   * Récupérer un produit par slug (public)
   */
  async findBySlug(slug: string) {
    const product = await this.productModel
      .findOne({ slug, status: ProductStatus.ACTIVE })
      .populate('shopId', 'name slug logo averageRating totalReviews');

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    // Incrémenter le compteur de vues
    product.viewsCount += 1;
    await product.save();

    // Si le produit a des variantes, les charger
    let variants = [];
    if (product.hasVariants) {
      variants = await this.variantModel.find({
        productId: product._id,
        isActive: true,
      });
    }

    return { product, variants };
  }

  /**
   * Récupérer un produit par ID
   */
  async findById(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('shopId', 'name slug logo');

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    return product;
  }

  /**
   * Récupérer les produits d'un vendeur
   */
  async findBySellerId(sellerId: string) {
    return this.productModel
      .find({ sellerId })
      .populate('shopId', 'name slug')
      .sort({ createdAt: -1 });
  }

  /**
   * Mettre à jour un produit (SELLER)
   */
  async update(productId: string, sellerId: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findOne({ _id: productId, sellerId });

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    // Si le nom est modifié, régénérer le slug
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const newSlug = slugify(updateProductDto.name, { lower: true, strict: true }) + '-' + Date.now();
      product.slug = newSlug;
    }

    Object.assign(product, updateProductDto);
    await product.save();

    return product;
  }

  /**
   * Supprimer un produit (SELLER)
   */
  async delete(productId: string, sellerId: string) {
    const product = await this.productModel.findOne({ _id: productId, sellerId });

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    // Archiver au lieu de supprimer
    product.status = ProductStatus.ARCHIVED;
    await product.save();

    // Décrémenter le compteur de produits de la boutique
    await this.shopModel.findByIdAndUpdate(product.shopId, {
      $inc: { totalProducts: -1 },
    });

    return { message: 'Produit archivé avec succès' };
  }

  // ===== VARIANTES =====

  /**
   * Créer une variante (SELLER)
   */
  async createVariant(productId: string, sellerId: string, createVariantDto: CreateVariantDto) {
    const product = await this.productModel.findOne({ _id: productId, sellerId });

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    if (!product.hasVariants) {
      throw new BadRequestException('Ce produit ne supporte pas les variantes');
    }

    // Vérifier l'unicité du SKU
    const existingSku = await this.variantModel.findOne({ sku: createVariantDto.sku });

    if (existingSku) {
      throw new BadRequestException('Ce SKU est déjà utilisé');
    }

    const variant = new this.variantModel({
      ...createVariantDto,
      productId,
    });

    await variant.save();
    return variant;
  }

  /**
   * Récupérer les variantes d'un produit
   */
  async findVariantsByProductId(productId: string) {
    return this.variantModel.find({ productId });
  }

  /**
   * Mettre à jour une variante (SELLER)
   */
  async updateVariant(
    variantId: string,
    sellerId: string,
    updateVariantDto: UpdateVariantDto,
  ) {
    const variant = await this.variantModel.findById(variantId).populate('productId');

    if (!variant) {
      throw new NotFoundException('Variante introuvable');
    }

    const product = await this.productModel.findOne({
      _id: variant.productId,
      sellerId,
    });

    if (!product) {
      throw new ForbiddenException('Vous n\'avez pas accès à cette variante');
    }

    Object.assign(variant, updateVariantDto);
    await variant.save();

    return variant;
  }

  /**
   * Supprimer une variante (SELLER)
   */
  async deleteVariant(variantId: string, sellerId: string) {
    const variant = await this.variantModel.findById(variantId).populate('productId');

    if (!variant) {
      throw new NotFoundException('Variante introuvable');
    }

    const product = await this.productModel.findOne({
      _id: variant.productId,
      sellerId,
    });

    if (!product) {
      throw new ForbiddenException('Vous n\'avez pas accès à cette variante');
    }

    await variant.deleteOne();
    return { message: 'Variante supprimée avec succès' };
  }

  // ===== ADMIN =====

  /**
   * Approuver un produit (ADMIN)
   */
  async approveProduct(productId: string, isApproved: boolean, note?: string) {
    const product = await this.productModel.findByIdAndUpdate(
      productId,
      { isApproved, approvalNote: note },
      { new: true },
    );

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    return product;
  }

  /**
   * Mettre en avant un produit (ADMIN)
   */
  async toggleFeatured(productId: string) {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    return product;
  }
}
