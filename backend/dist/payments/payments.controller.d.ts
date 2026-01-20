import { RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPaymentIntent(user: any, orderId: string): Promise<{
        clientSecret: string;
        paymentIntentId: string;
    }>;
    handleWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    }>;
    createConnectAccount(user: any): Promise<{
        accountId: string;
        onboardingUrl: string;
    }>;
    getConnectDashboard(user: any): Promise<{
        dashboardUrl: string;
    }>;
}
