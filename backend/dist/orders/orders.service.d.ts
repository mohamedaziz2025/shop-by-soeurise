import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from '../schemas/order.schema';
import { OrderItem, OrderItemDocument } from '../schemas/order-item.schema';
import { CartDocument } from '../schemas/cart.schema';
import { Shipment, ShipmentDocument } from '../schemas/shipment.schema';
import { ProductDocument } from '../schemas/product.schema';
import { CreateOrderDto } from './dto/order.dto';
export declare class OrdersService {
    private orderModel;
    private orderItemModel;
    private cartModel;
    private shipmentModel;
    private productModel;
    private configService;
    constructor(orderModel: Model<OrderDocument>, orderItemModel: Model<OrderItemDocument>, cartModel: Model<CartDocument>, shipmentModel: Model<ShipmentDocument>, productModel: Model<ProductDocument>, configService: ConfigService);
    createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<{
        parentOrder: import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        subOrders: any[];
        message: string;
    }>;
    private groupItemsByShop;
    findByCustomerId(customerId: string): Promise<(import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findById(orderId: string): Promise<{
        order: import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        subOrders: any[];
        items: (import("mongoose").Document<unknown, {}, OrderItemDocument, {}, {}> & OrderItem & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        shipments: (import("mongoose").Document<unknown, {}, ShipmentDocument, {}, {}> & Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    findBySellerId(sellerId: string): Promise<any[]>;
    updateStatus(orderId: string, status: OrderStatus): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    cancelOrder(orderId: string, userId: string, reason?: string): Promise<import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(filters?: {
        status?: string;
        customerId?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, OrderDocument, {}, {}> & Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
