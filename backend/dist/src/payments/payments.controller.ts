import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  Headers,
  RawBodyRequest,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../schemas/user.schema';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Créer un Payment Intent
   */
  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  async createPaymentIntent(
    @CurrentUser() user: any,
    @Body('orderId') orderId: string,
  ) {
    return this.paymentsService.createPaymentIntent(user.userId, orderId);
  }

  /**
   * Webhook Stripe
   * Note: Cette route ne doit pas être protégée par JWT
   */
  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.paymentsService.handleWebhook(signature, req.rawBody);
  }

  /**
   * Créer un compte Stripe Connect (SELLER)
   */
  @Post('connect/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async createConnectAccount(@CurrentUser() user: any) {
    return this.paymentsService.createConnectAccount(user.userId);
  }

  /**
   * Récupérer le dashboard Stripe Connect (SELLER)
   */
  @Get('connect/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async getConnectDashboard(@CurrentUser() user: any) {
    return this.paymentsService.getConnectDashboard(user.userId);
  }
}
