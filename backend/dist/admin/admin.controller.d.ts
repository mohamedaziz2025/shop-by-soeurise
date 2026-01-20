import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    getSalesStats(startDate: string, endDate: string): Promise<{
        totalRevenue: number;
        totalOrders: number;
        averageOrderValue: number;
        totalCommission: number;
    }>;
    getTopShops(limit?: number): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/shop.schema").ShopDocument, {}, {}> & import("../schemas/shop.schema").Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getTopProducts(limit?: number): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}, {}> & import("../schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getPendingShops(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/shop.schema").ShopDocument, {}, {}> & import("../schemas/shop.schema").Shop & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getPendingProducts(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/product.schema").ProductDocument, {}, {}> & import("../schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getRecentUsers(limit?: number): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/user.schema").UserDocument, {}, {}> & import("../schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getRecentOrders(limit?: number): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/order.schema").OrderDocument, {}, {}> & import("../schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getCommissionsReport(startDate: string, endDate: string): Promise<any[]>;
}
