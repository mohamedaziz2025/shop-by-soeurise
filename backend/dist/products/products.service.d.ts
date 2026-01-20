import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { ProductVariant, ProductVariantDocument } from '../schemas/product-variant.schema';
import { ShopDocument } from '../schemas/shop.schema';
import { CreateProductDto, UpdateProductDto, CreateVariantDto, UpdateVariantDto } from './dto/product.dto';
export declare class ProductsService {
    private productModel;
    private variantModel;
    private shopModel;
    constructor(productModel: Model<ProductDocument>, variantModel: Model<ProductVariantDocument>, shopModel: Model<ShopDocument>);
    create(sellerId: string, createProductDto: CreateProductDto): Promise<import("mongoose").Document<unknown, {}, ProductDocument, {}, {}> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(filters?: {
        shopId?: string;
        category?: string;
        status?: string;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        tags?: string[];
        isFeatured?: boolean;
    }): Promise<(import("mongoose").Document<unknown, {}, ProductDocument, {}, {}> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findBySlug(slug: string): Promise<{
        product: import("mongoose").Document<unknown, {}, ProductDocument, {}, {}> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        variants: any[];
    }>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, ProductDocument, {}, {}> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findBySellerId(sellerId: string): Promise<(import("mongoose").Document<unknown, {}, ProductDocument, {}, {}> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    update(productId: string, sellerId: string, updateProductDto: UpdateProductDto): Promise<import("mongoose").Document<unknown, {}, ProductDocument, {}, {}> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    delete(productId: string, sellerId: string): Promise<{
        message: string;
    }>;
    createVariant(productId: string, sellerId: string, createVariantDto: CreateVariantDto): Promise<import("mongoose").Document<unknown, {}, ProductVariantDocument, {}, {}> & ProductVariant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findVariantsByProductId(productId: string): Promise<(import("mongoose").Document<unknown, {}, ProductVariantDocument, {}, {}> & ProductVariant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateVariant(variantId: string, sellerId: string, updateVariantDto: UpdateVariantDto): Promise<import("mongoose").Document<unknown, {}, ProductVariantDocument, {}, {}> & ProductVariant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteVariant(variantId: string, sellerId: string): Promise<{
        message: string;
    }>;
    approveProduct(productId: string, isApproved: boolean, note?: string): Promise<import("mongoose").Document<unknown, {}, ProductDocument, {}, {}> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    toggleFeatured(productId: string): Promise<import("mongoose").Document<unknown, {}, ProductDocument, {}, {}> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
