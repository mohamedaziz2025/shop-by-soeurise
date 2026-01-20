import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Shop, ShopDocument } from '../schemas/shop.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Order, OrderDocument } from '../schemas/order.schema';
import { PaymentDocument } from '../schemas/payment.schema';
export declare class AdminService {
    private userModel;
    private shopModel;
    private productModel;
    private orderModel;
    private paymentModel;
    constructor(userModel: Model<UserDocument>, shopModel: Model<ShopDocument>, productModel: Model<ProductDocument>, orderModel: Model<OrderDocument>, paymentModel: Model<PaymentDocument>);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalShops: number;
        totalProducts: number;
        totalOrders: number;
        pendingShops: number;
        pendingProducts: number;
        monthlyRevenue: number;
        monthlyCommission: number;
    }>;
    getSalesStats(startDate: Date, endDate: Date): Promise<{
        totalRevenue: number;
        totalOrders: number;
        averageOrderValue: number;
        totalCommission: number;
    }>;
    getTopShops(limit?: number): Promise<(import("mongoose").Document<unknown, {}, ShopDocument, {}, {}> & Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getTopProducts(limit?: number): Promise<(import("mongoose").Document<unknown, {}, ProductDocument, {}, {}> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getPendingShops(): Promise<(import("mongoose").Document<unknown, {}, ShopDocument, {}, {}> & Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getPendingProducts(): Promise<(import("mongoose").Document<unknown, {}, ProductDocument, {}, {}> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getRecentUsers(limit?: number): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getRecentOrders(limit?: number): Promise<(import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getCommissionsReport(startDate: Date, endDate: Date): Promise<any[]>;
}
