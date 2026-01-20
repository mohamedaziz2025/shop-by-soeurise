import { ShipmentsService } from './shipments.service';
import { UpdateShipmentDto } from './dto/shipment.dto';
export declare class ShipmentsController {
    private readonly shipmentsService;
    constructor(shipmentsService: ShipmentsService);
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/shipment.schema").ShipmentDocument, {}, {}> & import("../schemas/shipment.schema").Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyShipments(user: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/shipment.schema").ShipmentDocument, {}, {}> & import("../schemas/shipment.schema").Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getSellerShipments(user: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/shipment.schema").ShipmentDocument, {}, {}> & import("../schemas/shipment.schema").Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateShipment(id: string, user: any, updateDto: UpdateShipmentDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/shipment.schema").ShipmentDocument, {}, {}> & import("../schemas/shipment.schema").Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllShipments(filters: {
        status?: string;
        sellerId?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/shipment.schema").ShipmentDocument, {}, {}> & import("../schemas/shipment.schema").Shipment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
