import { Model } from 'mongoose';
import { Shop, ShopDocument } from '../schemas/shop.schema';
import { UserDocument } from '../schemas/user.schema';
import { CreateShopDto, UpdateShopDto } from './dto/shop.dto';
export declare class ShopsService {
    private shopModel;
    private userModel;
    constructor(shopModel: Model<ShopDocument>, userModel: Model<UserDocument>);
    create(sellerId: string, createShopDto: CreateShopDto): Promise<import("mongoose").Document<unknown, {}, ShopDocument, {}, {}> & Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(filters?: {
        status?: string;
        category?: string;
        isFeatured?: boolean;
    }): Promise<(import("mongoose").Document<unknown, {}, ShopDocument, {}, {}> & Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findBySlug(slug: string): Promise<import("mongoose").Document<unknown, {}, ShopDocument, {}, {}> & Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, ShopDocument, {}, {}> & Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findBySellerId(sellerId: string): Promise<import("mongoose").Document<unknown, {}, ShopDocument, {}, {}> & Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(sellerId: string, updateShopDto: UpdateShopDto): Promise<import("mongoose").Document<unknown, {}, ShopDocument, {}, {}> & Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    delete(sellerId: string): Promise<{
        message: string;
    }>;
    updateStatus(shopId: string, status: string): Promise<import("mongoose").Document<unknown, {}, ShopDocument, {}, {}> & Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    toggleFeatured(shopId: string): Promise<import("mongoose").Document<unknown, {}, ShopDocument, {}, {}> & Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    setCompliance(shopId: string, isCompliant: boolean, reason?: string): Promise<import("mongoose").Document<unknown, {}, ShopDocument, {}, {}> & Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
