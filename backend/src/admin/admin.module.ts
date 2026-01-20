import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { Shop, ShopSchema } from '../schemas/shop.schema';
import { Product, ProductSchema } from '../schemas/product.schema';
import { Order, OrderSchema } from '../schemas/order.schema';
import { Payment, PaymentSchema } from '../schemas/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Shop.name, schema: ShopSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
