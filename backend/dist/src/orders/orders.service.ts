import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus, PaymentStatus } from '../schemas/order.schema';
import { OrderItem, OrderItemDocument } from '../schemas/order-item.schema';
import { Cart, CartDocument } from '../schemas/cart.schema';
import { Shipment, ShipmentDocument } from '../schemas/shipment.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItemDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Shipment.name) private shipmentModel: Model<ShipmentDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private configService: ConfigService,
  ) {}

  /**
   * Créer une commande à partir du panier (avec split automatique par boutique)
   */
  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    // Récupérer le panier
    const cart = await this.cartModel
      .findOne({ userId })
      .populate('items.productId')
      .populate('items.shopId');

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Votre panier est vide');
    }

    // Regrouper les items par boutique
    const itemsByShop = this.groupItemsByShop(cart.items);

    // Créer une commande parente (globale)
    const platformCommissionRate =
      this.configService.get<number>('PLATFORM_COMMISSION_RATE') || 20;

    const parentOrder = new this.orderModel({
      customerId: userId,
      shippingAddress: createOrderDto.shippingAddress,
      billingAddress: createOrderDto.billingAddress || createOrderDto.shippingAddress,
      customerNote: createOrderDto.customerNote,
      status: OrderStatus.PENDING_PAYMENT,
      paymentStatus: PaymentStatus.PENDING,
      subtotal: 0,
      shippingTotal: 0,
      total: 0,
      isSubOrder: false,
    });

    await parentOrder.save();

    // Créer une sous-commande pour chaque boutique
    const subOrders = [];

    for (const [shopId, shopItems] of Object.entries(itemsByShop)) {
      const shop = (shopItems as any)[0].shopId;

      // Calculer les totaux pour cette boutique
      const subtotal = (shopItems as any).reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0,
      );

      // Calculer les frais de livraison
      let shippingCost = 0;

      if (shop.shippingConfig?.enabled) {
        if (
          shop.shippingConfig.freeShippingThreshold &&
          subtotal >= shop.shippingConfig.freeShippingThreshold
        ) {
          shippingCost = 0;
        } else if (shop.shippingConfig.flatRate) {
          shippingCost = shop.shippingConfig.flatRate;
        }

        // Appliquer le plafond
        if (
          shop.shippingConfig.maxShippingCost &&
          shippingCost > shop.shippingConfig.maxShippingCost
        ) {
          shippingCost = shop.shippingConfig.maxShippingCost;
        }
      }

      const total = subtotal + shippingCost;

      // Créer la sous-commande
      const subOrder = new this.orderModel({
        customerId: userId,
        shippingAddress: createOrderDto.shippingAddress,
        billingAddress: createOrderDto.billingAddress || createOrderDto.shippingAddress,
        customerNote: createOrderDto.customerNote,
        status: OrderStatus.PENDING_PAYMENT,
        paymentStatus: PaymentStatus.PENDING,
        subtotal,
        shippingTotal: shippingCost,
        total,
        parentOrderId: parentOrder._id,
        isSubOrder: true,
      });

      await subOrder.save();

      // Créer les OrderItems
      for (const item of shopItems as any) {
        const product = item.productId;

        const orderItem = new this.orderItemModel({
          orderId: subOrder._id,
          shopId,
          sellerId: product.sellerId,
          productId: product._id,
          variantId: item.variantId,
          productSnapshot: {
            name: product.name,
            slug: product.slug,
            image: product.mainImage,
            sku: product.sku,
            variantName: item.variantId ? 'Variante' : undefined,
          },
          quantity: item.quantity,
          unitPrice: item.price,
          platformCommissionRate,
          shippingCost: shippingCost / (shopItems as any).length, // Proratisation
        });

        await orderItem.save();
      }

      // Créer le shipment pour cette sous-commande
      const shipment = new this.shipmentModel({
        orderId: subOrder._id,
        shopId,
        sellerId: shop.sellerId,
        customerId: userId,
        status: 'PENDING',
        shippingAddress: createOrderDto.shippingAddress,
        shippingCost,
      });

      await shipment.save();

      subOrders.push(subOrder);

      // Mettre à jour les totaux de la commande parente
      parentOrder.subtotal += subtotal;
      parentOrder.shippingTotal += shippingCost;
      parentOrder.total += total;
    }

    await parentOrder.save();

    // Vider le panier
    cart.items = [];
    await cart.save();

    return {
      parentOrder,
      subOrders,
      message: 'Commande créée avec succès',
    };
  }

  /**
   * Regrouper les items du panier par boutique
   */
  private groupItemsByShop(items: any[]): Record<string, any[]> {
    return items.reduce((acc, item) => {
      const shopId = item.shopId._id.toString();

      if (!acc[shopId]) {
        acc[shopId] = [];
      }

      acc[shopId].push(item);
      return acc;
    }, {});
  }

  /**
   * Récupérer les commandes d'un utilisateur
   */
  async findByCustomerId(customerId: string) {
    return this.orderModel
      .find({ customerId, isSubOrder: false })
      .sort({ createdAt: -1 });
  }

  /**
   * Récupérer une commande par ID
   */
  async findById(orderId: string) {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }

    // Si c'est une commande parente, récupérer les sous-commandes
    let subOrders = [];
    if (!order.isSubOrder) {
      subOrders = await this.orderModel.find({ parentOrderId: order._id });
    }

    // Récupérer les items
    const items = await this.orderItemModel
      .find({ orderId: order._id })
      .populate('productId', 'name slug mainImage')
      .populate('shopId', 'name slug');

    // Récupérer les shipments
    const shipments = await this.shipmentModel.find({ orderId: order._id });

    return {
      order,
      subOrders,
      items,
      shipments,
    };
  }

  /**
   * Récupérer les commandes d'un vendeur
   */
  async findBySellerId(sellerId: string) {
    const items = await this.orderItemModel
      .find({ sellerId })
      .populate('orderId')
      .populate('productId', 'name slug mainImage')
      .sort({ createdAt: -1 });

    // Regrouper par commande
    const ordersMap = new Map();

    for (const item of items) {
      const orderId = typeof item.orderId === 'string' ? item.orderId : (item.orderId as any)._id.toString();

      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          order: item.orderId,
          items: [],
        });
      }

      ordersMap.get(orderId).items.push(item);
    }

    return Array.from(ordersMap.values());
  }

  /**
   * Mettre à jour le statut d'une commande (SELLER/ADMIN)
   */
  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }

    return order;
  }

  /**
   * Annuler une commande
   */
  async cancelOrder(orderId: string, userId: string, reason?: string) {
    const order = await this.orderModel.findOne({
      _id: orderId,
      customerId: userId,
    });

    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT && order.status !== OrderStatus.PAID) {
      throw new BadRequestException('Cette commande ne peut plus être annulée');
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();
    order.cancellationReason = reason;

    await order.save();

    return order;
  }

  /**
   * Récupérer toutes les commandes (ADMIN)
   */
  async findAll(filters?: { status?: string; customerId?: string }) {
    const query: any = { isSubOrder: false };

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.customerId) {
      query.customerId = filters.customerId;
    }

    return this.orderModel
      .find(query)
      .populate('customerId', 'firstName lastName email')
      .sort({ createdAt: -1 });
  }
}
