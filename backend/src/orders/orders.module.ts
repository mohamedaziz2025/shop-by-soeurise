import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from '../schemas/order.schema';
import { OrderItem, OrderItemSchema } from '../schemas/order-item.schema';
import { Cart, CartSchema } from '../schemas/cart.schema';
import { Shipment, ShipmentSchema } from '../schemas/shipment.schema';
import { Product, ProductSchema } from '../schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderItem.name, schema: OrderItemSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Shipment.name, schema: ShipmentSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
