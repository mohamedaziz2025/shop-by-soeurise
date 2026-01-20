import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class UpdateShipmentDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  carrier?: string;

  @IsString()
  @IsOptional()
  carrierOther?: string;

  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @IsString()
  @IsOptional()
  trackingUrl?: string;

  @IsDateString()
  @IsOptional()
  estimatedDeliveryDate?: string;

  @IsString()
  @IsOptional()
  sellerNote?: string;

  @IsString()
  @IsOptional()
  deliveryNote?: string;
}
