import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/order.dto';
import { OrderStatus } from '../schemas/order.schema';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(user: any, createOrderDto: CreateOrderDto): Promise<{
        parentOrder: import("mongoose").Document<unknown, {}, import("../schemas/order.schema").OrderDocument, {}, {}> & import("../schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        subOrders: any[];
        message: string;
    }>;
    getMyOrders(user: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/order.schema").OrderDocument, {}, {}> & import("../schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getOrderById(id: string): Promise<{
        order: import("mongoose").Document<unknown, {}, import("../schemas/order.schema").OrderDocument, {}, {}> & import("../schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        subOrders: any[];
        items: (import("mongoose").Document<unknown, {}, import("../schemas/order-item.schema").OrderItemDocument, {}, {}> & import("../schemas/order-item.schema").OrderItem & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        shipments: (import("mongoose").Document<unknown, {}, import("../schemas/shipment.schema").ShipmentDocument, {}, {}> & import("../schemas/shipment.schema").Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    cancelOrder(id: string, user: any, reason?: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/order.schema").OrderDocument, {}, {}> & import("../schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getSellerOrders(user: any): Promise<any[]>;
    updateOrderStatus(id: string, status: OrderStatus): Promise<import("mongoose").Document<unknown, {}, import("../schemas/order.schema").OrderDocument, {}, {}> & import("../schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllOrders(filters: {
        status?: string;
        customerId?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/order.schema").OrderDocument, {}, {}> & import("../schemas/order.schema").Order & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
