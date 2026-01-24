import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../schemas/user.schema';
import { OrderStatus } from '../schemas/order.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Routes CLIENT
  @Post()
  async createOrder(
    @CurrentUser() user: any,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(user.userId, createOrderDto);
  }

  @Get('my-orders')
  async getMyOrders(@CurrentUser() user: any) {
    return this.ordersService.findByCustomerId(user.userId);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Put(':id/cancel')
  async cancelOrder(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('reason') reason?: string,
  ) {
    return this.ordersService.cancelOrder(id, user.userId, reason);
  }

  // Routes SELLER
  @Get('seller/orders')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SELLER)
  async getSellerOrders(@CurrentUser() user: any) {
    return this.ordersService.findBySellerId(user.userId);
  }

  @Put('seller/:id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  // Routes ADMIN
  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllOrders(@Query() filters: { status?: string; customerId?: string }) {
    return this.ordersService.findAll(filters);
  }
}
