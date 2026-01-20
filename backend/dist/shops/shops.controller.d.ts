import { ShopsService } from './shops.service';
import { CreateShopDto, UpdateShopDto } from './dto/shop.dto';
export declare class ShopsController {
    private readonly shopsService;
    constructor(shopsService: ShopsService);
    findAll(filters: {
        status?: string;
        category?: string;
        isFeatured?: boolean;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/shop.schema").ShopDocument, {}, {}> & import("../schemas/shop.schema").Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findBySlug(slug: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/shop.schema").ShopDocument, {}, {}> & import("../schemas/shop.schema").Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/shop.schema").ShopDocument, {}, {}> & import("../schemas/shop.schema").Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    create(user: any, createShopDto: CreateShopDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/shop.schema").ShopDocument, {}, {}> & import("../schemas/shop.schema").Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyShop(user: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/shop.schema").ShopDocument, {}, {}> & import("../schemas/shop.schema").Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(user: any, updateShopDto: UpdateShopDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/shop.schema").ShopDocument, {}, {}> & import("../schemas/shop.schema").Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    delete(user: any): Promise<{
        message: string;
    }>;
    updateStatus(id: string, status: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/shop.schema").ShopDocument, {}, {}> & import("../schemas/shop.schema").Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    toggleFeatured(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/shop.schema").ShopDocument, {}, {}> & import("../schemas/shop.schema").Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    setCompliance(id: string, body: {
        isCompliant: boolean;
        reason?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("../schemas/shop.schema").ShopDocument, {}, {}> & import("../schemas/shop.schema").Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
