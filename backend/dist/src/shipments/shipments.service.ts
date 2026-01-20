import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shipment, ShipmentDocument } from '../schemas/shipment.schema';
import { UpdateShipmentDto } from './dto/shipment.dto';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectModel(Shipment.name) private shipmentModel: Model<ShipmentDocument>,
  ) {}

  /**
   * Récupérer un shipment par ID
   */
  async findById(shipmentId: string) {
    const shipment = await this.shipmentModel
      .findById(shipmentId)
      .populate('orderId')
      .populate('shopId', 'name slug')
      .populate('customerId', 'firstName lastName email');

    if (!shipment) {
      throw new NotFoundException('Expédition introuvable');
    }

    return shipment;
  }

  /**
   * Récupérer les shipments d'un vendeur
   */
  async findBySellerId(sellerId: string) {
    return this.shipmentModel
      .find({ sellerId })
      .populate('orderId')
      .populate('shopId', 'name slug')
      .populate('customerId', 'firstName lastName email')
      .sort({ createdAt: -1 });
  }

  /**
   * Récupérer les shipments d'un client
   */
  async findByCustomerId(customerId: string) {
    return this.shipmentModel
      .find({ customerId })
      .populate('orderId')
      .populate('shopId', 'name slug logo')
      .sort({ createdAt: -1 });
  }

  /**
   * Mettre à jour un shipment (SELLER)
   */
  async update(shipmentId: string, sellerId: string, updateDto: UpdateShipmentDto) {
    const shipment = await this.shipmentModel.findOne({
      _id: shipmentId,
      sellerId,
    });

    if (!shipment) {
      throw new NotFoundException('Expédition introuvable');
    }

    // Mettre à jour les champs
    Object.assign(shipment, updateDto);

    // Si le statut est "SHIPPED", enregistrer la date
    if (updateDto.status === 'SHIPPED' && !shipment.shippedAt) {
      shipment.shippedAt = new Date();
    }

    // Si le statut est "DELIVERED", enregistrer la date
    if (updateDto.status === 'DELIVERED' && !shipment.deliveredAt) {
      shipment.deliveredAt = new Date();
    }

    await shipment.save();

    return shipment;
  }

  /**
   * Récupérer tous les shipments (ADMIN)
   */
  async findAll(filters?: { status?: string; sellerId?: string }) {
    const query: any = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.sellerId) {
      query.sellerId = filters.sellerId;
    }

    return this.shipmentModel
      .find(query)
      .populate('orderId')
      .populate('shopId', 'name slug')
      .populate('customerId', 'firstName lastName email')
      .sort({ createdAt: -1 });
  }
}
