import { Model } from 'mongoose';
import { Shipment, ShipmentDocument } from '../schemas/shipment.schema';
import { UpdateShipmentDto } from './dto/shipment.dto';
export declare class ShipmentsService {
    private shipmentModel;
    constructor(shipmentModel: Model<ShipmentDocument>);
    findById(shipmentId: string): Promise<import("mongoose").Document<unknown, {}, ShipmentDocument, {}, {}> & Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findBySellerId(sellerId: string): Promise<(import("mongoose").Document<unknown, {}, ShipmentDocument, {}, {}> & Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findByCustomerId(customerId: string): Promise<(import("mongoose").Document<unknown, {}, ShipmentDocument, {}, {}> & Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    update(shipmentId: string, sellerId: string, updateDto: UpdateShipmentDto): Promise<import("mongoose").Document<unknown, {}, ShipmentDocument, {}, {}> & Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(filters?: {
        status?: string;
        sellerId?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, ShipmentDocument, {}, {}> & Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
