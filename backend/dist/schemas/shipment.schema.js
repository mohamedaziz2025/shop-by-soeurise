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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentSchema = exports.Shipment = exports.ShippingCarrier = exports.ShipmentStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var ShipmentStatus;
(function (ShipmentStatus) {
    ShipmentStatus["PENDING"] = "PENDING";
    ShipmentStatus["PREPARING"] = "PREPARING";
    ShipmentStatus["SHIPPED"] = "SHIPPED";
    ShipmentStatus["IN_TRANSIT"] = "IN_TRANSIT";
    ShipmentStatus["DELIVERED"] = "DELIVERED";
    ShipmentStatus["FAILED"] = "FAILED";
    ShipmentStatus["RETURNED"] = "RETURNED";
})(ShipmentStatus || (exports.ShipmentStatus = ShipmentStatus = {}));
var ShippingCarrier;
(function (ShippingCarrier) {
    ShippingCarrier["COLISSIMO"] = "COLISSIMO";
    ShippingCarrier["CHRONOPOST"] = "CHRONOPOST";
    ShippingCarrier["DHL"] = "DHL";
    ShippingCarrier["UPS"] = "UPS";
    ShippingCarrier["MONDIAL_RELAY"] = "MONDIAL_RELAY";
    ShippingCarrier["OTHER"] = "OTHER";
})(ShippingCarrier || (exports.ShippingCarrier = ShippingCarrier = {}));
let Shipment = class Shipment {
};
exports.Shipment = Shipment;
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'Order', required: true }),
    __metadata("design:type", String)
], Shipment.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'Shop', required: true }),
    __metadata("design:type", String)
], Shipment.prototype, "shopId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'User', required: true }),
    __metadata("design:type", String)
], Shipment.prototype, "sellerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'User', required: true }),
    __metadata("design:type", String)
], Shipment.prototype, "customerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ShipmentStatus, default: ShipmentStatus.PENDING }),
    __metadata("design:type", String)
], Shipment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            firstName: String,
            lastName: String,
            street: String,
            city: String,
            postalCode: String,
            country: String,
            phone: String,
            additionalInfo: String,
        },
        required: true,
    }),
    __metadata("design:type", Object)
], Shipment.prototype, "shippingAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ShippingCarrier }),
    __metadata("design:type", String)
], Shipment.prototype, "carrier", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shipment.prototype, "carrierOther", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shipment.prototype, "trackingNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shipment.prototype, "trackingUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Shipment.prototype, "shippingCost", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Shipment.prototype, "estimatedDeliveryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Shipment.prototype, "shippedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Shipment.prototype, "deliveredAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shipment.prototype, "sellerNote", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shipment.prototype, "deliveryNote", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shipment.prototype, "proofOfDelivery", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                status: String,
                note: String,
                timestamp: { type: Date, default: Date.now },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Shipment.prototype, "statusHistory", void 0);
exports.Shipment = Shipment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Shipment);
exports.ShipmentSchema = mongoose_1.SchemaFactory.createForClass(Shipment);
exports.ShipmentSchema.index({ orderId: 1 });
exports.ShipmentSchema.index({ shopId: 1, status: 1 });
exports.ShipmentSchema.index({ sellerId: 1, createdAt: -1 });
exports.ShipmentSchema.index({ customerId: 1, status: 1 });
exports.ShipmentSchema.index({ trackingNumber: 1 });
exports.ShipmentSchema.index({ status: 1, createdAt: -1 });
exports.ShipmentSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date(),
        });
    }
    next();
});
//# sourceMappingURL=shipment.schema.js.map