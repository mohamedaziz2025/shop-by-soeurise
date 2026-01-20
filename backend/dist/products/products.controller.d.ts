import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, CreateVariantDto, UpdateVariantDto } from './dto/product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(filters: {
        shopId?: string;
        category?: string;
        status?: string;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        tags?: string[];
        isFeatured?: boolean;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}, {}> & import("../schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findBySlug(slug: string): Promise<{
        product: import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}, {}> & import("../schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        variants: any[];
    }>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}, {}> & import("../schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    create(user: any, createProductDto: CreateProductDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}, {}> & import("../schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyProducts(user: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}, {}> & import("../schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    update(id: string, user: any, updateProductDto: UpdateProductDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}, {}> & import("../schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    delete(id: string, user: any): Promise<{
        message: string;
    }>;
    createVariant(id: string, user: any, createVariantDto: CreateVariantDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/product-variant.schema").ProductVariantDocument, {}, {}> & import("../schemas/product-variant.schema").ProductVariant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getVariants(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/product-variant.schema").ProductVariantDocument, {}, {}> & import("../schemas/product-variant.schema").ProductVariant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateVariant(variantId: string, user: any, updateVariantDto: UpdateVariantDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/product-variant.schema").ProductVariantDocument, {}, {}> & import("../schemas/product-variant.schema").ProductVariant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteVariant(variantId: string, user: any): Promise<{
        message: string;
    }>;
    approveProduct(id: string, body: {
        isApproved: boolean;
        note?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}, {}> & import("../schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    toggleFeatured(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}, {}> & import("../schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
