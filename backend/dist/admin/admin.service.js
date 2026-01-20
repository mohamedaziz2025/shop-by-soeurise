"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const shop_schema_1 = require("../schemas/shop.schema");
const product_schema_1 = require("../schemas/product.schema");
const order_schema_1 = require("../schemas/order.schema");
const payment_schema_1 = require("../schemas/payment.schema");
let AdminService = class AdminService {
    constructor(userModel, shopModel, productModel, orderModel, paymentModel) {
        this.userModel = userModel;
        this.shopModel = shopModel;
        this.productModel = productModel;
        this.orderModel = orderModel;
        this.paymentModel = paymentModel;
    }
    async getDashboardStats() {
        const [totalUsers, totalShops, totalProducts, totalOrders, pendingShops, pendingProducts,] = await Promise.all([
            this.userModel.countDocuments(),
            this.shopModel.countDocuments({ status: 'ACTIVE' }),
            this.productModel.countDocuments({ status: 'ACTIVE' }),
            this.orderModel.countDocuments({ isSubOrder: false }),
            this.shopModel.countDocuments({ status: 'PENDING_APPROVAL' }),
            this.productModel.countDocuments({ isApproved: false }),
        ]);
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const monthlyOrders = await this.orderModel.find({
            isSubOrder: false,
            paymentStatus: 'PAID',
            paidAt: { $gte: startOfMonth },
        });
        const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);
        const monthlyPayments = await this.paymentModel.find({
            status: 'SUCCEEDED',
            paidAt: { $gte: startOfMonth },
        });
        const monthlyCommission = monthlyPayments.reduce((sum, payment) => sum + payment.totalPlatformCommission, 0);
        return {
            totalUsers,
            totalShops,
            totalProducts,
            totalOrders,
            pendingShops,
            pendingProducts,
            monthlyRevenue,
            monthlyCommission,
        };
    }
    async getSalesStats(startDate, endDate) {
        const orders = await this.orderModel.find({
            isSubOrder: false,
            paymentStatus: 'PAID',
            paidAt: { $gte: startDate, $lte: endDate },
        });
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const payments = await this.paymentModel.find({
            status: 'SUCCEEDED',
            paidAt: { $gte: startDate, $lte: endDate },
        });
        const totalCommission = payments.reduce((sum, payment) => sum + payment.totalPlatformCommission, 0);
        return {
            totalRevenue,
            totalOrders,
            averageOrderValue,
            totalCommission,
        };
    }
    async getTopShops(limit = 10) {
        return this.shopModel
            .find({ status: 'ACTIVE' })
            .sort({ totalSales: -1 })
            .limit(limit)
            .select('name slug totalSales totalOrders averageRating');
    }
    async getTopProducts(limit = 10) {
        return this.productModel
            .find({ status: 'ACTIVE' })
            .sort({ salesCount: -1 })
            .limit(limit)
            .populate('shopId', 'name slug')
            .select('name slug mainImage salesCount averageRating price');
    }
    async getPendingShops() {
        return this.shopModel
            .find({ status: 'PENDING_APPROVAL' })
            .populate('sellerId', 'firstName lastName email')
            .sort({ createdAt: -1 });
    }
    async getPendingProducts() {
        return this.productModel
            .find({ isApproved: false })
            .populate('shopId', 'name slug')
            .populate('sellerId', 'firstName lastName email')
            .sort({ createdAt: -1 });
    }
    async getRecentUsers(limit = 20) {
        return this.userModel
            .find()
            .select('-password -refreshToken')
            .sort({ createdAt: -1 })
            .limit(limit);
    }
    async getRecentOrders(limit = 20) {
        return this.orderModel
            .find({ isSubOrder: false })
            .populate('customerId', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .limit(limit);
    }
    async getCommissionsReport(startDate, endDate) {
        const payments = await this.paymentModel
            .find({
            status: 'SUCCEEDED',
            paidAt: { $gte: startDate, $lte: endDate },
        })
            .populate('orderId')
            .sort({ paidAt: -1 });
        const commissionsByShop = new Map();
        for (const payment of payments) {
            for (const split of payment.splits) {
                const shopId = split.shopId.toString();
                if (!commissionsByShop.has(shopId)) {
                    commissionsByShop.set(shopId, {
                        shopId,
                        totalSales: 0,
                        totalCommission: 0,
                        orderCount: 0,
                    });
                }
                const shopData = commissionsByShop.get(shopId);
                shopData.totalSales += split.amount;
                shopData.totalCommission += split.platformCommission;
                shopData.orderCount += 1;
            }
        }
        return Array.from(commissionsByShop.values());
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(shop_schema_1.Shop.name)),
    __param(2, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(3, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(4, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
//# sourceMappingURL=admin.service.js.map