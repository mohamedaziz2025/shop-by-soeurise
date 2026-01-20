import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from '../schemas/payment.schema';
import { OrderDocument } from '../schemas/order.schema';
import { OrderItemDocument } from '../schemas/order-item.schema';
import { SellerProfileDocument } from '../schemas/seller-profile.schema';
export declare class PaymentsService {
    private paymentModel;
    private orderModel;
    private orderItemModel;
    private sellerProfileModel;
    private configService;
    private stripe;
    constructor(paymentModel: Model<PaymentDocument>, orderModel: Model<OrderDocument>, orderItemModel: Model<OrderItemDocument>, sellerProfileModel: Model<SellerProfileDocument>, configService: ConfigService);
    createPaymentIntent(userId: string, orderId: string): Promise<{
        clientSecret: string;
        paymentIntentId: string;
    }>;
    confirmPayment(paymentIntentId: string): Promise<{
        payment: import("mongoose").Document<unknown, {}, PaymentDocument, {}, {}> & Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        splits: any[];
    }>;
    handleWebhook(signature: string, payload: Buffer): Promise<{
        received: boolean;
    }>;
    private handlePaymentFailed;
    private handleRefund;
    createConnectAccount(sellerId: string): Promise<{
        accountId: string;
        onboardingUrl: string;
    }>;
    getConnectDashboard(sellerId: string): Promise<{
        dashboardUrl: string;
    }>;
}
