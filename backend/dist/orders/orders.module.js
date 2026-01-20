"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const orders_service_1 = require("./orders.service");
const orders_controller_1 = require("./orders.controller");
const order_schema_1 = require("../schemas/order.schema");
const order_item_schema_1 = require("../schemas/order-item.schema");
const cart_schema_1 = require("../schemas/cart.schema");
const shipment_schema_1 = require("../schemas/shipment.schema");
const product_schema_1 = require("../schemas/product.schema");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema },
                { name: order_item_schema_1.OrderItem.name, schema: order_item_schema_1.OrderItemSchema },
                { name: cart_schema_1.Cart.name, schema: cart_schema_1.CartSchema },
                { name: shipment_schema_1.Shipment.name, schema: shipment_schema_1.ShipmentSchema },
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
            ]),
        ],
        controllers: [orders_controller_1.OrdersController],
        providers: [orders_service_1.OrdersService],
        exports: [orders_service_1.OrdersService],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map